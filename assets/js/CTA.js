  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbywshrunBcM2Y-Hi12RYidFRCoZ4mlUj2OA4dsthxaqiwq5kHQBRfY1htiTD9jrGgm48Q/exec';

  const form = document.getElementById('subscribe-form');
  const submitButton = document.getElementById('submit-button');
  const successMessage = document.getElementById('success-message');

  form.addEventListener('submit', function(e) {
    e.preventDefault(); // منع إعادة تحميل الصفحة

    submitButton.disabled = true; // تعطيل الزر أثناء الإرسال
    submitButton.textContent = 'جارٍ الإرسال...';

    fetch(SCRIPT_URL, {
      method: 'POST',
      body: new FormData(form)
    })
    .then(response => response.json())
    .then(data => {
      if (data.result === 'success') {
        successMessage.style.display = 'block'; // إظهار رسالة النجاح
        form.style.display = 'none'; // إخفاء النموذج
      } else {
        // في حالة حدوث خطأ، يمكنك عرض رسالة خطأ
        alert('حدث خطأ. يرجى المحاولة مرة أخرى.');
        submitButton.disabled = false;
        submitButton.textContent = 'اشترك الآن';
      }
    })
    .catch(error => {
      // التعامل مع أخطاء الشبكة
      console.error('Error!', error.message);
      alert('حدث خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
      submitButton.disabled = false;
      submitButton.textContent = 'اشترك الآن';
    });
  });