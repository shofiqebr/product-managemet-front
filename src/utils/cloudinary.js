// export const uploadImageToCloudinary = async (file) => {
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("upload_preset", "rasel_product"); // your unsigned preset name
//   formData.append("cloud_name", "dal1rjdwl"); // your cloud name

//   const res = await fetch(
//     `https://api.cloudinary.com/v1_1/dal1rjdwl/image/upload`,
//     {
//       method: "POST",
//       body: formData,
//     }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to upload image");
//   }

//   const data = await res.json();
//   console.log("Uploaded image URL:", url);
//   return data.secure_url; // Cloudinary hosted image URL
// };


export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "rasel_product"); // must match your Cloudinary unsigned preset

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dal1rjdwl/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const error = await res.text();
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }

  const data = await res.json();
  console.log("Uploaded image URL:", data.secure_url);
  return data.secure_url; // hosted URL
};
