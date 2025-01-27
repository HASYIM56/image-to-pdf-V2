$(document).ready(function () {
    const { jsPDF } = window.jspdf;

    // Show notification bar after 2 seconds
    setTimeout(function() {
        $('#notifBar').fadeIn(2000);  // Fade in over 2 seconds
    }, 2000);  // Wait 2 seconds before showing

    // Hide notification bar after 4 seconds (total 6 seconds from page load)
    setTimeout(function() {
        $('#notifBar').fadeOut(2000);  // Fade out over 2 seconds
    }, 6000);  // Hide after 6 seconds (2 seconds delay + 4 seconds show)

    $('#fileForm').on('submit', function (e) {
        e.preventDefault();

        const file = $('#fileInput')[0].files[0];

        if (!file) {
            alert("Please select an image to convert.");
            return;
        }

        const reader = new FileReader();
        $('#loadingContainer').show();
        $('#loadingBar').css('width', '0%');
        $('#loadingText').text('0%');

        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(function () {
            progress += 10;
            $('#loadingBar').css('width', progress + '%');
            $('#loadingText').text(progress + '%');

            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 200);

        // Read the image and convert it to PDF
        reader.onload = function (event) {
            const imgData = event.target.result;

            // Create an image element to get its natural size
            const img = new Image();
            img.onload = function () {
                // Get the natural width and height of the image
                const imgWidth = img.width;
                const imgHeight = img.height;

                // Create a new jsPDF instance
                const doc = new jsPDF();

                // Calculate scale factor to fit the image within the A4 page size (210mm x 297mm)
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                const scaleFactor = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

                // Calculate the width and height of the image in the PDF
                const pdfWidth = imgWidth * scaleFactor;
                const pdfHeight = imgHeight * scaleFactor;

                // Add image to the PDF with calculated width and height
                doc.addImage(imgData, 'JPEG', 15, 40, pdfWidth, pdfHeight);

                // Add watermark text in the center
                const watermarkText = "CREATED BY HASYIM56";
                const fontSize = 30;
                doc.setFontSize(fontSize);
                doc.setTextColor(150, 150, 150);  // Light gray color for watermark
                doc.text(watermarkText, pageWidth / 2, pageHeight / 2, { align: 'center' });

                // Apply opacity to watermark (for better visibility)
                doc.setTextColor(150, 150, 150, 0.3);  // 30% opacity

                // Generate PDF blob output
                const pdfOutput = doc.output('blob');

                // Create a download link
                const url = URL.createObjectURL(pdfOutput);

                $('#downloadButton')
                    .attr('href', url)
                    .attr('download', 'Doc_img_H56.pdf')
                    .show();

                $('#statusMessage').text("Conversion successful! Click download to get the PDF.");
                $('#loadingContainer').hide();
            };

            // Set the image source to trigger loading
            img.src = imgData;
        };

        reader.onerror = function () {
            $('#statusMessage').text("Error reading file. Please try again.");
            $('#loadingContainer').hide();
        };

        reader.readAsDataURL(file);
    });
});