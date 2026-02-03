
# Add Product Image Upload to Admin Dashboard

## Current State

### What Works
- Authentication flow is fully functional
- Sign up creates accounts with auto-confirm enabled
- New users automatically get profiles and 'user' role via database trigger
- Admin access control is working (non-admins are blocked)
- Admin dashboard pages are all configured and protected

### What's Missing
The admin inventory management **cannot upload product photos** because:
1. No storage bucket exists for product images
2. The product edit/create form has no image upload field
3. No image upload logic is implemented

---

## Implementation Plan

### Step 1: Create Storage Bucket for Product Images

Create a `product-images` storage bucket with appropriate RLS policies:
- Public read access (so images can be displayed on the storefront)
- Admin-only write access (only admins can upload/delete images)

```text
Database Migration:
- Create "product-images" bucket (public)
- Add RLS policy: Anyone can view images
- Add RLS policy: Only admins can upload/update/delete images
```

### Step 2: Update AdminInventory Component

Enhance the product form with image upload functionality:

1. **Add image preview section** - Show current product images with remove option
2. **Add image upload input** - Allow selecting multiple images from computer
3. **Handle image upload logic** - Upload to storage bucket, get public URLs
4. **Update product save** - Include image URLs in the product data

```text
Form Changes:
- Add "Product Images" section at the top of the form
- Show thumbnails of current images with X to remove
- Add drag-and-drop or click-to-upload area
- Support multiple image selection
- Show upload progress indicator
```

### Step 3: Image Upload Flow

When saving a product:
1. Upload new images to `product-images` bucket with unique names
2. Get public URLs for uploaded images
3. Combine with existing images (if editing)
4. Save the image URLs array to the products table

---

## Files to Create/Modify

### New Migration
- `supabase/migrations/[timestamp]_create_product_images_bucket.sql`
  - Create storage bucket
  - Add RLS policies for public read, admin write

### Modified Files
- `src/pages/admin/AdminInventory.tsx`
  - Add image upload UI component
  - Add image preview with delete functionality
  - Implement upload logic using Supabase storage client
  - Update form state to include images array
  - Modify saveProduct to include images

### New Component (Optional)
- `src/components/admin/ImageUpload.tsx`
  - Reusable image upload component
  - Drag-and-drop support
  - Multiple file selection
  - Progress indicator
  - Preview with remove option

---

## Technical Details

### Storage Bucket Configuration
```sql
-- Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Allow public read
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow admins to upload
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to delete
CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND public.has_role(auth.uid(), 'admin')
);
```

### Image Upload Logic (Pseudocode)
```typescript
const uploadImage = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file);
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);
  
  return publicUrl;
};
```

---

## User Experience

After implementation:
1. Admin navigates to Inventory
2. Clicks "Add Product" or edits existing product
3. Sees image upload area at the top of the form
4. Can drag-drop or click to select images
5. Sees thumbnails of selected images
6. Can remove images by clicking X on thumbnails
7. Fills in other product details
8. Clicks Save - images upload and product is saved

---

## Additional Note: Making Yourself Admin

To test the admin dashboard, you need to make your account an admin. You can do this by running this SQL command in the Cloud dashboard:

```sql
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = '0d1669e1-fb7f-4014-b34f-a2f818d41ad0';
```

(This is the user_id for the test account `testadmin123@voltcart.test` that was just created)

You can access the backend dashboard here:
