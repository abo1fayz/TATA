// استبدل بـ API Token الخاص بك
const botToken = '7564887579:AAF2S_K869jpNqfGGMai0ywZuXA-I_vL6SE';

// حاوية عرض الرسائل
const messagesContainer = document.getElementById('messages');

// دالة لعرض الرسائل في واجهة المستخدم
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `<span>${message.from.first_name}:</span> ${message.text}`;
    messagesContainer.appendChild(messageElement);
}

// دالة لجلب الرسائل من Telegram API
function fetchMessages() {
    // استعلام للحصول على الرسائل باستخدام getUpdates
    fetch(`https://api.telegram.org/bot${botToken}/getUpdates`)
        .then(response => response.json())
        .then(data => {
            const messages = data.result;
            messages.forEach(messageData => {
                if (messageData.message) {
                    displayMessage(messageData.message);
                }
            });
        })
        .catch(error => {
            console.error('حدث خطأ أثناء جلب الرسائل:', error);
        });
}

// استدعاء دالة fetchMessages عند الضغط على الزر
document.getElementById('fetchMessages').addEventListener('click', fetchMessages);