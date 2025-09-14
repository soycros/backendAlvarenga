const socket = io();

socket.on('update-products', products => {
  const list = document.getElementById('product-list');
  list.innerHTML = '';

  products.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${p.title}</strong> - $${p.price}<br>
      <small>ID: ${p.id}</small><br>
      <button data-id="${p.id}" class="delete-btn">Eliminar</button>
    `;
    list.appendChild(li);
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      socket.emit('delete-product', id);
    });
  });
});

document.getElementById('add-form').addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const product = Object.fromEntries(formData.entries());
  socket.emit('new-product', product);
  e.target.reset();
});
