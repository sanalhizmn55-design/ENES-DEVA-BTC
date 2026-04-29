// Firebase Modüllerini içeri aktarıyoruz
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Senin verdiğin özel bağlantı bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyAkTTJmxZR6ku5XXxto4ENOIBwVL7FVCzI",
  authDomain: "enes-deva-btc.firebaseapp.com",
  projectId: "enes-deva-btc",
  storageBucket: "enes-deva-btc.firebasestorage.app",
  messagingSenderId: "604187079585",
  appId: "1:604187079585:web:0fb4c23f629868f7cbd1e0"
};

// Firebase'i başlatıyoruz
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// KAYIT OLMA FONKSİYONU
window.kayitOl = async () => {
    const ad = document.getElementById('name').value;
    const soyad = document.getElementById('surname').value;
    const sehir = document.getElementById('city').value;
    const email = document.getElementById('email').value;
    const sifre = document.getElementById('pass').value;

    if(!ad || !soyad || !email || !sifre) { alert("Lütfen boş alan bırakmayın!"); return; }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, sifre);
        const user = userCredential.user;
        
        // Firestore Veritabanına kullanıcının tüm bilgilerini kaydediyoruz
        await setDoc(doc(db, "kullanicilar", user.uid), {
            adSoyad: ad + " " + soyad,
            sehir: sehir,
            email: email,
            sifre: sifre, // Senin admin panelinde görebilmen için
            bakiye: 0,
            rol: "user",
            kayitTarihi: new Date().toLocaleString()
        });
        
        alert("Kayıt Başarılı! Yatırım dünyasına hoş geldiniz.");
        window.location.href = "index.html"; // Kayıttan sonra sayfayı yeniler veya yönlendirir
    } catch (error) {
        alert("Hata: " + error.message);
    }
};

// ADMİN İÇİN: KULLANICILARI ÇEKME FONKSİYONU
window.kullanicilariGetir = async () => {
    const liste = document.getElementById('user-list');
    if(!liste) return;
    
    const querySnapshot = await getDocs(collection(db, "kullanicilar"));
    liste.innerHTML = "";
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        liste.innerHTML += `
            <div style="border:1px solid #f39c12; margin:10px; padding:10px; border-radius:8px;">
                <p><b>Ad Soyad:</b> ${data.adSoyad}</p>
                <p><b>Yaşadığı Yer:</b> ${data.sehir}</p>
                <p><b>E-posta:</b> ${data.email}</p>
                <p><b>Şifre:</b> ${data.sifre}</p>
                <p><b>Bakiye:</b> $${data.bakiye}</p>
            </div>
        `;
    });
};
