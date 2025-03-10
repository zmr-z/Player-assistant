document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('search-btn');
    const gameQuery = document.getElementById('game-query');
    const aiResponse = document.getElementById('ai-response');
    
    // Store API key in a constant (Note: In production, this should be stored securely on a backend server)
    const DEEPSEEK_API_KEY = 'sk-df040cc50fa64d4aafad9390662c5673';

    searchBtn.addEventListener('click', async function() {
        const query = gameQuery.value.trim();
        if (!query) {
            aiResponse.textContent = 'Please enter a question about a game.';
            return;
        }

        // Show loading state
        aiResponse.textContent = 'Getting answer...';
        
        try {
            const response = await getDeepseekResponse(query);
            aiResponse.textContent = response;
        } catch (error) {
            aiResponse.textContent = 'Sorry, there was an error getting the response. Please try again.';
            console.error('Error:', error);
        }
    });

    async function getDeepseekResponse(query) {
        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [{
                        role: "user",
                        content: `Game question: ${query}`
                    }],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
});
