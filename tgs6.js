fetch("tgs6.json")
  .then(response => response.json())
  .then(data => {
    const soalKuis = data.quiz;

    let indeksSoalSekarang = 0;
    let jawaban = new Array(soalKuis.length).fill(null);
    let skor = 0;

    const halamanLogin = document.getElementById('halaman_login');
    const halamanAturan = document.getElementById('halaman_aturan');
    const halamanKuis = document.getElementById('halaman_kuis');
    const halamanHasil = document.getElementById('halaman_hasil');

    const formLogin = document.getElementById('login_form');
    const errorLogin = document.getElementById('login_error');

    const tombolMulai = document.getElementById('startBtn');
    const timerEl = document.getElementById('timer');
    const nomorSoalEl = document.getElementById('question_number');
    const teksSoalEl = document.getElementById('question_text');
    const opsiJawabanEl = document.getElementById('answer_options');
    const tombolKembali = document.getElementById('prev_btn');
    const tombolLanjut = document.getElementById('next_btn');
    const tombolKirim = document.getElementById('submit_btn');

    // Menambahkan elemen untuk menampilkan skor akhir
    const skorEl = document.getElementById('skor_akhir');  // Pastikan ada elemen dengan id "skor_akhir" di halaman_hasil

    let intervalTimer;

    // Login user
    formLogin.addEventListener('submit', (event) => {
      event.preventDefault();

      const inputUsername = document.getElementById('username').value;
      const inputPassword = document.getElementById('password').value;

      if (inputUsername === 'admin091' && inputPassword === 'admin091') {
        errorLogin.textContent = '';
        Swal.fire({
          icon: 'success',
          title: 'Login Berhasil!',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          halamanLogin.style.display = 'none';
          halamanAturan.style.display = 'block';
        });
      } else {
        errorLogin.textContent = 'Username atau Password salah!';
        errorLogin.style.color = 'red';
      }
    });

    // Timer mundur
    function mulaiHitungmundur(durasiDalamMenit) {
      let waktu = durasiDalamMenit * 60;

      intervalTimer = setInterval(() => {
        const menit = String(Math.floor((waktu % 3600) / 60)).padStart(2, '0');
        const detik = String(waktu % 60).padStart(2, '0');
        timerEl.textContent = `Waktu tersisa: ${menit}:${detik}`;

        if (waktu <= 0) {
          clearInterval(intervalTimer);
          hitungSkor();
          Swal.fire({
            title: 'Waktu telah habis!',
            icon: 'warning',
            confirmButtonText: 'OK'
          }).then(() => {
            halamanKuis.style.display = 'none';
            halamanHasil.style.display = 'block';
            skorEl.textContent = `Skor Anda: ${skor} dari 100`;
          });
        }

        waktu--;
      }, 1000);
    }

    // Menampilkan soal
    function tampilkanSoal() {
      const soalSekarang = soalKuis[indeksSoalSekarang];

      nomorSoalEl.textContent = `Soal ${indeksSoalSekarang + 1} dari ${soalKuis.length}`;
      teksSoalEl.textContent = soalSekarang.soal;
      opsiJawabanEl.innerHTML = '';

      soalSekarang.opsi.forEach(opsi => {
        const li = document.createElement('li');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'jawaban';
        input.value = opsi;
        input.id = `jawaban_${opsi}_${indeksSoalSekarang}`;
        input.checked = jawaban[indeksSoalSekarang] === opsi;

        input.addEventListener('change', () => {
          jawaban[indeksSoalSekarang] = opsi;
          hitungSkor(); // menghitung skor
        });

        const label = document.createElement('label');
        label.htmlFor = input.id;
        label.textContent = opsi;

        li.appendChild(input);
        li.appendChild(label);
        opsiJawabanEl.appendChild(li);
      });

      tombolKembali.disabled = indeksSoalSekarang === 0;
      tombolLanjut.disabled = indeksSoalSekarang === soalKuis.length - 1;
      tombolKirim.style.display = indeksSoalSekarang === soalKuis.length - 1 ? 'inline-block' : 'none';
    }

    // Menghitung skor akhir
    function hitungSkor() {
      skor = 0;
      soalKuis.forEach((soal, idx) => {
        if (jawaban[idx] === soal.answer) {
          skor += 10;
        }
      });
    }

    // Tombol navigasi soal
    tombolKembali.addEventListener('click', () => {
      if (indeksSoalSekarang > 0) {
        indeksSoalSekarang--;
        tampilkanSoal();
      }
    });

    tombolLanjut.addEventListener('click', () => {
      if (indeksSoalSekarang < soalKuis.length - 1) {
        indeksSoalSekarang++;
        tampilkanSoal();
      }
    });

    // Tombol kirim
    tombolKirim.addEventListener('click', () => {
      clearInterval(intervalTimer);
      hitungSkor();
      Swal.fire({
        title: 'Terkirim',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        halamanKuis.style.display = 'none';
        halamanHasil.style.display = 'block';
        skorEl.textContent = `Skor Anda: ${skor} dari 100`;  // Menampilkan skor di halaman hasil
      });
    });

    // Mulai kuis
    tombolMulai.addEventListener('click', () => {
      tombolMulai.disabled = true;
      halamanAturan.style.display = 'none';
      halamanKuis.style.display = 'block';
      tampilkanSoal();
      mulaiHitungmundur(30); // Waktu kuis 30 menit
    });
  })
  .catch(error => {
    console.error('Terjadi kesalahan saat memuat data:', error);
  });
