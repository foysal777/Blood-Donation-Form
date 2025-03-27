async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "shimanto"); 

    try {
        let response = await fetch("https://api.cloudinary.com/v1_1/di2tzvjoe/image/upload", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            let data = await response.json();
            console.log('Cloudinary রেসপন্স:', data);  

            if (data.secure_url) {
                console.log('Cloudinary Image URL:', data.secure_url);
                return data.secure_url;
            } else {
                console.error('Cloudinary থেকে secure_url পাওয়া যায়নি');
                return '';
            }
        } else {
            console.error('Cloudinary আপলোড ব্যর্থ:', response.status);
            return '';
        }
    } catch (error) {
        console.error('Cloudinary আপলোডে সমস্যা:', error);
        return '';
    }
}

document.getElementById("submitButton").addEventListener("click", async function (event) {
    event.preventDefault();

    // 🟢 ফর্ম ডাটা সংগ্রহ
    let fileInput = document.getElementById("imageUpload");
    let name = document.getElementById("name").value.trim();
    let address = document.getElementById("address").value.trim();
    let donor_position = document.getElementById("donor_position").value.trim();
    let date = document.getElementById("date").value.trim();
    let blood_group = document.getElementById("blood_group").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let donation_place = document.getElementById("donation_place").value.trim();
    let imageUrl = "";

    //  চেক করা হবে যে বাধ্যতামূলক ফিল্ডগুলো ফাঁকা কি না
    if (!name || !address || !donor_position || !date || !blood_group || !phone || !donation_place) {
        alert("⚠️ অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন।");
        return; // সাবমিট বন্ধ হবে
    }

    //  চেক করা হবে ছবি দেওয়া হয়েছে কি না
    if (fileInput.files.length > 0) {
        console.log("Selected file:", fileInput.files[0]);
        imageUrl = await uploadImageToCloudinary(fileInput.files[0]);
        console.log("Image URL:", imageUrl);
    }

    let formData = {
        name,
        address,
        donor_position,
        date,
        blood_group,
        phone,
        donation_place,
        image_url: imageUrl 
    };

    console.log("Final Form Data:", formData);

    try {
        let response = await fetch("https://blood-donation-backend-omega-nine.vercel.app/blood-donation/donors/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log("✅ ফর্ম সফলভাবে জমা হয়েছে:", responseData);
            alert("✅ ফর্ম সফলভাবে জমা হয়েছে!");
            document.getElementById("donationForm").reset();
        } else {
            alert("❌ জমা দিতে ব্যর্থ! আবার চেষ্টা করুন।");
        }
    } catch (error) {
        console.error("❌ সার্ভার ত্রুটি:", error);
        alert("❌ একটি সমস্যা হয়েছে! সার্ভার চালু আছে কিনা চেক করুন।");
    }
});
