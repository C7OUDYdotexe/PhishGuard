document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('scan-btn');
    const emailInput = document.getElementById('email-content');
    const resultContainer = document.getElementById('result-container');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const confidenceScore = document.getElementById('confidence-score');
    const confidenceBar = document.getElementById('confidence-bar');
    const statusIcon = document.getElementById('status-icon-i');
    const resultCard = document.querySelector('.result-card');

    scanBtn.addEventListener('click', async () => {
        const text = emailInput.value.trim();

        if (!text) {
            alert('Please enter some text to analyze.');
            return;
        }

        // Loading state
        scanBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';
        scanBtn.disabled = true;
        resultContainer.classList.add('hidden');

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: text })
            });

            const data = await response.json();

            if (data.error) {
                alert(data.error);
                return;
            }

            // Update UI
            resultContainer.classList.remove('hidden');
            
            // Reset classes
            resultCard.classList.remove('safe', 'phishing');
            statusIcon.className = 'fa-solid';

            const percentage = Math.round(data.confidence * 100);
            
            if (data.is_phishing) {
                resultCard.classList.add('phishing');
                statusIcon.classList.add('fa-triangle-exclamation');
                resultTitle.textContent = 'Phishing Detected';
                resultMessage.innerHTML = `High probability of threat. <br>Confidence: <span id="confidence-score">${percentage}%</span>`;
            } else {
                resultCard.classList.add('safe');
                statusIcon.classList.add('fa-shield-check');
                resultTitle.textContent = 'Content Seems Safe';
                resultMessage.innerHTML = `No threats detected. <br>Confidence: <span id="confidence-score">${100 - percentage}%</span>`; // Invert for safe
            }

            // Animate bar
            setTimeout(() => {
                confidenceBar.style.width = `${data.is_phishing ? percentage : 100 - percentage}%`;
            }, 100);

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while analyzing the text.');
        } finally {
            // Reset button
            scanBtn.innerHTML = '<span class="btn-text">Scan Now</span><i class="fa-solid fa-radar"></i>';
            scanBtn.disabled = false;
        }
    });
});
