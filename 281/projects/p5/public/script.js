// Wait for the DOM to load before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.monster-btn');
    const messageElement = document.getElementById('message');

    // Add event listeners for each monster button
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const monsterNumber = this.getAttribute('data-monster');

            // Prompt for player name
            const playerName = prompt('Enter your player name:');

            if (!playerName) {
                alert('Please enter a valid player name.');
                return;
            }

            // Send the selected monster and player name to the server
            fetch('/pick', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    playerName: playerName,
                    monsterNumber: parseInt(monsterNumber),
                }),
            })
            .then(response => response.json())
            .then(data => {
                // Update the message area with the server's response
                if (data.success) {
                    messageElement.textContent = `${data.success} Let's start the fight!`;
                } else {
                    messageElement.textContent = `Error: ${data.error}`;
                }
            })
            .catch(error => {
                messageElement.textContent = `An error occurred: ${error.message}`;
            });
        });
    });
});
