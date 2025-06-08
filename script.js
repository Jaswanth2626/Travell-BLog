const header = document.querySelector("header");

window.addEventListener("scroll", function () {
  header.classList.toggle("sticky", window.scrollY > 60);
});

let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
  menu.classList.toggle('bx-x');
  navbar.classList.toggle('open');
};

// Modal Logic
document.querySelectorAll('.button').forEach(button => {
  button.addEventListener('click', () => {
    document.getElementById('bookingModal').style.display = 'block';
  });
});

document.querySelector('.close-button').onclick = function () {
  document.getElementById('bookingModal').style.display = 'none';
};

window.onclick = function (event) {
  if (event.target == document.getElementById('bookingModal')) {
    document.getElementById('bookingModal').style.display = 'none';
  }
};

// Booking Form Logic with localStorage
let bookings = [];
const form = document.getElementById('bookingForm');
const dataList = document.getElementById('bookingDataList');

window.onload = function () {
  const saved = localStorage.getItem('bookings');
  if (saved) {
    bookings = JSON.parse(saved);
    displayBookings();
  }
};

function saveToLocalStorage() {
  localStorage.setItem('bookings', JSON.stringify(bookings));
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  bookings.push({ name, email, phone });
  saveToLocalStorage();
  displayBookings();
  form.reset();
  document.getElementById('bookingModal').style.display = 'none';
});

function displayBookings() {
  dataList.innerHTML = '';
  bookings.forEach((b, index) => {
    const item = document.createElement('div');
    item.className = 'booking-item';
    item.innerHTML = `
      <strong>${b.name}</strong><br>Email: ${b.email}<br>Phone: ${b.phone}
      <button onclick="editBooking(${index})">Edit</button>
      <button onclick="deleteBooking(${index})">Delete</button>
    `;
    dataList.appendChild(item);
  });
}

window.editBooking = function(index) {
  const booking = bookings[index];
  document.getElementById('name').value = booking.name;
  document.getElementById('email').value = booking.email;
  document.getElementById('phone').value = booking.phone;
  bookings.splice(index, 1);
  saveToLocalStorage();
  displayBookings();
  document.getElementById('bookingModal').style.display = 'block';
};

window.deleteBooking = function(index) {
  bookings.splice(index, 1);
  saveToLocalStorage();
  displayBookings();
};

// CSV Export
document.getElementById("downloadCSV").addEventListener("click", function () {
  if (bookings.length === 0) {
    alert("No bookings to download.");
    return;
  }

  const headers = ["Name", "Email", "Phone"];
  const rows = bookings.map(b => [b.name, b.email, b.phone]);

  let csvContent = "data:text/csv;charset=utf-8,"
    + headers.join(",") + "\\n"
    + rows.map(e => e.join(",")).join("\\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "bookings.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
