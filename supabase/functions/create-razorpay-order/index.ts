import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  selectedColor?: string;
  selectedVariant?: string;
}

interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get auth token from header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User authenticated:', user.id);

    const body: CreateOrderRequest = await req.json();
    const { items, shippingAddress, subtotal, shipping, tax, total } = body;

    // Validate required fields
    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Cart is empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || 
        !shippingAddress.addressLine1 || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.pincode) {
      return new Response(
        JSON.stringify({ error: 'Invalid shipping address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Razorpay credentials
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Razorpay order
    const razorpayOrderData = {
      amount: Math.round(total * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        user_id: user.id,
        email: user.email,
      },
    };

    console.log('Creating Razorpay order:', razorpayOrderData);

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${razorpayKeyId}:${razorpayKeySecret}`),
      },
      body: JSON.stringify(razorpayOrderData),
    });

    if (!razorpayResponse.ok) {
      const errorText = await razorpayResponse.text();
      console.error('Razorpay API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to create payment order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const razorpayOrder = await razorpayResponse.json();
    console.log('Razorpay order created:', razorpayOrder.id);

    // Generate order number
    const orderNumber = 'VC' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + 
                        Math.floor(Math.random() * 100000).toString().padStart(5, '0');

    // Create order in database using service role (bypasses RLS)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: 'pending',
        subtotal,
        shipping,
        tax,
        total,
        shipping_name: shippingAddress.name,
        shipping_phone: shippingAddress.phone,
        shipping_address_line1: shippingAddress.addressLine1,
        shipping_address_line2: shippingAddress.addressLine2 || null,
        shipping_city: shippingAddress.city,
        shipping_state: shippingAddress.state,
        shipping_pincode: shippingAddress.pincode,
        shipping_country: shippingAddress.country || 'India',
        payment_method: 'razorpay',
        payment_status: 'pending',
        razorpay_order_id: razorpayOrder.id,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Database error creating order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order in database' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order created in database:', order.id);

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      product_image: item.productImage || null,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.unitPrice * item.quantity,
      selected_color: item.selectedColor || null,
      selected_variant: item.selectedVariant || null,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Database error creating order items:', itemsError);
      // Delete the order if items failed
      await supabase.from('orders').delete().eq('id', order.id);
      return new Response(
        JSON.stringify({ error: 'Failed to create order items' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order items created successfully');

    return new Response(
      JSON.stringify({
        orderId: order.id,
        orderNumber: order.order_number,
        razorpayOrderId: razorpayOrder.id,
        razorpayKeyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
