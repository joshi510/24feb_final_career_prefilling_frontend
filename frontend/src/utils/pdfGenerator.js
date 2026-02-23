// Install: npm install jspdf html2canvas
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDF(element, user, interpretation, counsellorNote = null, riasecReport = null) {
  try {
    // Create a loading indicator
    const loadingElement = document.createElement('div');
    loadingElement.style.position = 'fixed';
    loadingElement.style.top = '50%';
    loadingElement.style.left = '50%';
    loadingElement.style.transform = 'translate(-50%, -50%)';
    loadingElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    loadingElement.style.color = 'white';
    loadingElement.style.padding = '20px';
    loadingElement.style.borderRadius = '8px';
    loadingElement.style.zIndex = '10000';
    loadingElement.textContent = 'Generating PDF...';
    document.body.appendChild(loadingElement);

    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get the PDF container - element is the ref to pdf-container div
    const pdfContainer = element.querySelector('#result-pdf');
    if (!pdfContainer) {
      console.error('PDF container #result-pdf not found. Element:', element);
      throw new Error('PDF container #result-pdf not found');
    }

    // Store parent container styles
    const parentContainer = element;
    const originalParentStyle = {
      position: parentContainer.style.position,
      left: parentContainer.style.left,
      top: parentContainer.style.top,
      visibility: parentContainer.style.visibility,
      opacity: parentContainer.style.opacity,
      zIndex: parentContainer.style.zIndex,
      pointerEvents: parentContainer.style.pointerEvents
    };

    // Make parent container visible for html2canvas
    parentContainer.style.position = 'fixed';
    parentContainer.style.left = '0';
    parentContainer.style.top = '0';
    parentContainer.style.visibility = 'visible';
    parentContainer.style.opacity = '1';
    parentContainer.style.zIndex = '9999';
    parentContainer.style.pointerEvents = 'none';

    // Ensure PDF container is visible and has proper styles
    pdfContainer.style.backgroundColor = '#ffffff';
    pdfContainer.style.color = '#000000';
    pdfContainer.style.width = '800px';
    pdfContainer.style.maxWidth = '800px';

    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 300));

    // Convert element to canvas - capture ONCE
    const canvas = await html2canvas(pdfContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 800,
      windowWidth: 800,
      allowTaint: false,
      removeContainer: false
    });

    // Restore original parent styles
    Object.keys(originalParentStyle).forEach(key => {
      if (originalParentStyle[key] !== undefined && originalParentStyle[key] !== '') {
        parentContainer.style[key] = originalParentStyle[key];
      } else {
        parentContainer.style.removeProperty(key);
      }
    });

    // Remove loading indicator
    document.body.removeChild(loadingElement);

    // Calculate PDF dimensions - Use A4 width but allow unlimited height (no page breaks)
    const imgWidth = 210; // A4 width in mm
    const margin = 10; // 10mm margins
    const contentWidth = imgWidth - (margin * 2);
    
    // Calculate image dimensions
    const imgHeight = (canvas.height * contentWidth) / canvas.width;
    
    // Create PDF with custom height (no page breaks - single continuous page)
    // Use a very large height to accommodate all content
    const pdfHeight = Math.max(imgHeight + (margin * 2), 297); // At least A4 height, but can be larger
    const pdf = new jsPDF('p', 'mm', [imgWidth, pdfHeight]);
    
    // Add entire content as a single page (no breaks)
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      margin,
      margin,
      contentWidth,
      imgHeight
    );

    // Generate filename
    const fileName = `Career_Report_${user?.full_name?.replace(/\s+/g, '_') || 'Student'}_${new Date().toISOString().split('T')[0]}.pdf`;

    // Save PDF
    pdf.save(fileName);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}
