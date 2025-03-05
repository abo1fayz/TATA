// استبدل بـ API Token الخاص بك
const botToken = '7564887579:AAF2S_K869jpNqfGGMai0ywZuXA-I_vL6SE'; // ضع التوكن الخاص بك هنا
const chatId = '5555170485'; // ضع معرف المستخدم الخاص بك هنا

// مرجع لعناصر الإدخال والزر
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');
const usernameInput = document.getElementById('usernameInput');
const startChatButton = document.getElementById('startChat');
const chatContainer = document.getElementById('chat-container');
const loginContainer = document.getElementById('login-container');

// حاوية عرض الرسائل
const messagesContainer = document.getElementById('messages');

// تخزين آخر `update_id` تم استلامه
let lastUpdateId = 0;

// استرجاع اسم المستخدم من localStorage
let userName = localStorage.getItem('username');

// إذا كان المستخدم قد سجل اسمه مسبقًا، ندخله مباشرة إلى المحادثة
if (userName) {
    showChat();
}

// دالة لإظهار واجهة المحادثة بعد التسجيل
function showChat() {
    loginContainer.style.display = 'none';  // إخفاء شاشة التسجيل
    chatContainer.style.display = 'block';  // إظهار شاشة المحادثة
}

// دالة لعرض الرسائل في واجهة المستخدم مع التاريخ والوقت بصيغة الساعة 12
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    // الحصول على التاريخ والوقت الحالي
    const currentDate = new Date();
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'مساءً' : 'صباحًا';
    
    // تحويل الوقت من 24 ساعة إلى 12 ساعة
    hours = hours % 12;
    hours = hours ? hours : 12; // إذا كانت الساعة 0، اجعلها 12
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    // إضافة الرسالة مع التاريخ والوقت
    messageElement.innerHTML = `
        <span>${message.from.first_name}:</span> ${message.text} 
        <span class="message-time">(${formattedTime})</span>
    `;
    messagesContainer.appendChild(messageElement);
}

// دالة لجلب الرسائل من Telegram API
function fetchMessages() {
    fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${lastUpdateId + 1}`)
        .then(response => response.json())
        .then(data => {
            const messages = data.result;
            if (messages.length > 0) {
                messages.forEach(messageData => {
                    if (messageData.message) {
                        lastUpdateId = messageData.update_id;
                        displayMessage(messageData.message);
                    }
                });
            }
        })
        .catch(error => {
            console.error('حدث خطأ أثناء جلب الرسائل:', error);
        });
}

// دالة لإرسال رسالة إلى Telegram
function sendMessageToTelegram(messageText) {
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: messageText
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            displayMessage({ from: { first_name: userName }, text: messageText });
            messageInput.value = ''; // مسح حقل النص
        } else {
            console.error('خطأ في إرسال الرسالة:', data);
            alert("حدث خطأ أثناء الإرسال! تأكد من صلاحيات البوت.");
        }
    })
    .catch(error => {
        console.error('حدث خطأ أثناء الإرسال:', error);
        alert("تعذر الاتصال بالخادم. تأكد من اتصالك بالإنترنت.");
    });
}

// عند الضغط على زر "ابدأ المحادثة" في صفحة التسجيل
startChatButton.addEventListener('click', function() {
    const username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem('username', username);  // حفظ الاسم في localStorage
        userName = username;
        showChat();  // إظهار واجهة المحادثة
    } else {
        alert("يرجى إدخال اسمك");
    }
});

// عند الضغط على زر "إرسال" في واجهة المحادثة
sendMessageButton.addEventListener('click', function() {
    const messageText = messageInput.value.trim();
    if (messageText) {
        sendMessageToTelegram(messageText);
    } else {
        alert("يرجى كتابة رسالة!");
    }
});

// جلب الرسائل عند تحميل الصفحة
fetchMessages();

// تحديث الرسائل كل 3 ثواني
setInterval(fetchMessages, 3000);
