window.onload = function () {
  const imagesDiv = document.querySelector("#images");
  const fileInput = document.querySelector("#upload");
  const sizeInput = document.querySelector("#sizeInput");
  const updateButton = document.querySelector("#updateButton");

  updateButton.addEventListener("click", watermarkImages);

  fileInput.addEventListener("change", () => {
    watermarkImages();
  });

  async function watermarkImages() {
    const files = fileInput.files;

    // Clear previous images
    const imagesContainer = document.querySelector("#imagesContainer");
    imagesContainer.innerHTML = "";

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Create a container for each image
      const imageContainer = document.createElement("div");
      imageContainer.classList.add("image-container");

      // Create a wrapper for the images
      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add("image-wrapper");

      // Create an image element for the uploaded image
      const uploadedImage = document.createElement("img");
      uploadedImage.classList.add("thumbnail");

      uploadedImage.onload = async function () {
        URL.revokeObjectURL(this.src); // Release the object URL

        // Calculate the aspect ratio of the uploaded image
        const aspectRatio = uploadedImage.width / uploadedImage.height;

        // Create a canvas element for watermarking
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        // Set canvas dimensions to match the uploaded image
        canvas.width = uploadedImage.width;
        canvas.height = uploadedImage.height;

        // Draw the uploaded image onto the canvas
        context.drawImage(uploadedImage, 0, 0);

        // Load the watermark image
        const watermarkImage = await loadImage("./watermark.png");

        // Calculate the size of the watermark based on the canvas dimensions and user input
        const watermarkSizePercent = parseInt(sizeInput.value) || 100;
        const watermarkWidth = (canvas.width * watermarkSizePercent) / 100;
        const watermarkHeight =
          (watermarkWidth * watermarkImage.height) / watermarkImage.width;

        // Calculate the position to center the watermark
        const watermarkX = (canvas.width - watermarkWidth) / 2;
        const watermarkY = (canvas.height - watermarkHeight) / 2;

        // Overlay the watermark image on top of the uploaded image
        context.drawImage(
          watermarkImage,
          watermarkX,
          watermarkY,
          watermarkWidth,
          watermarkHeight
        );

        // Create a preview image element for the watermarked image
        const watermarkedPreview = document.createElement("img");
        watermarkedPreview.classList.add("thumbnail");
        watermarkedPreview.src = canvas.toDataURL();

        // Append the preview images to the image wrapper
        imageWrapper.appendChild(uploadedImage);
        imageWrapper.appendChild(watermarkedPreview);

        // Append the image wrapper and download button to the image container
        imageContainer.appendChild(imageWrapper);
        imageContainer.appendChild(createDownloadButton(canvas.toDataURL()));

        // Append the image container to the images container
        imagesContainer.appendChild(imageContainer);
      };

      // Set the uploaded image source to the object URL
      uploadedImage.src = URL.createObjectURL(file);
    }

    // Show the images container
    imagesDiv.style.visibility = "visible";
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = function () {
        resolve(image);
      };
      image.onerror = function () {
        reject(new Error(`Failed to load image: ${src}`));
      };
      image.src = src;
    });
  }

  function createDownloadButton(imageDataUrl) {
    const downloadButton = document.createElement("a");
    downloadButton.classList.add("download-button");
    downloadButton.innerHTML = "Tải về";

    // Set the download attribute and data URL
    downloadButton.download = "watermarked_image.png";
    downloadButton.href = imageDataUrl;

    return downloadButton;
  }
};
