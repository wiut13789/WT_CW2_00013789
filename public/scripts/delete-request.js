const btns = document.querySelectorAll('.danger')

btns.forEach(btn => {
    btn.addEventListener('click', () => {
        const path = '/transactions/' + encodeURIComponent(btn.getAttribute('data-id'))
        fetch(path, {
          method: 'DELETE',
        }).then(response => {
            if (response.status === 200) {
              const transactionId = btn.getAttribute('data-id');
              const transactionElem = document.querySelector(`[data-id="${transactionId}"`);
              transactionElem.parentElement.parentElement.remove();
            }
          });
      });
})

  