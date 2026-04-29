import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAkTTJmxZR6ku5XXxto4ENOIBwVL7FVCzI",
  authDomain: "enes-deva-btc.firebaseapp.com",
  projectId: "enes-deva-btc",
  storageBucket: "enes-deva-btc.firebasestorage.app",
  messagingSenderId: "604187079585",
  appId: "1:604187079585:web:0fb4c23f629868f7cbd1e0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.kayitOl = async () => {
    const ad = document.getElementById('name').value;
    const soyad = document.getElementById('surname').value;
    const sehir = document.getElementById('city').value;
    const email = document.getElementById('email').value;
    const sifre = document.getElementById('pass').value;

    if(!ad || !soyad || !email || !sifre) { alert("Lütfen tüm alanları doldurun!"); return; }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, sifre);
        const user = userCredential.user;
        
        await setDoc(doc(db, "kullanicilar", user.uid), {
            adSoyad: ad + " " + soyad,
            sehir: sehir,
            email: email,
            sifre: sifre,
            bakiye: 0,
            kayitTarihi: new Date().toLocaleString()
        });
        
        alert("Kayıt Başarılı! Panelinize yönlendiriliyorsunuz.");
        window.location.href = "panel.html"; 
    } catch (error) {
        alert("Hata: " + error.message);
    }
};

window.kullanicilariGetir = async () => {
    const liste = document.getElementById('user-list');
    if(!liste) return;
    const querySnapshot = await getDocs(collection(db, "kullanicilar"));
    liste.innerHTML = "";
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        liste.innerHTML += `
            <div style="border:1px solid #f39c12; margin:10px; padding:15px; border-radius:10px; background:#1a1a1a;">
                <p><b>Müşteri:</b> ${data.adSoyad}</p>
                <p><b>Şehir:</b> ${data.sehir}</p>
                <p><b>E-posta:</b> ${data.email}</p>
                <p><b>Şifre:</b> ${data.sifre}</p>
                <p><b>Bakiye:</b> <span style="color:#27ae60">$${data.bakiye}</span></p>
            </div>`;
    });
};
