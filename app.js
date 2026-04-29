import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// KAYIT OLMA
window.kayitOl = async () => {
    const ad = document.getElementById('reg-name').value;
    const soyad = document.getElementById('reg-surname').value;
    const sehir = document.getElementById('reg-city').value;
    const email = document.getElementById('reg-email').value;
    const sifre = document.getElementById('reg-pass').value;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, sifre);
        await setDoc(doc(db, "kullanicilar", userCredential.user.uid), {
            adSoyad: ad + " " + soyad, sehir: sehir, email: email, sifre: sifre, bakiye: 0
        });
        window.location.href = "panel.html";
    } catch (e) { alert("Hata: " + e.message); }
};

// GİRİŞ YAPMA
window.girisYap = async () => {
    const email = document.getElementById('login-email').value;
    const sifre = document.getElementById('login-pass').value;
    try {
        await signInWithEmailAndPassword(auth, email, sifre);
        window.location.href = "panel.html";
    } catch (e) { alert("Hatalı Giriş!"); }
};

// ÇIKIŞ
window.cikisYap = async () => { await signOut(auth); window.location.href = "index.html"; };

// BAKİYE VE İŞLEMLER
window.bakiyeGoster = () => {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const docRef = doc(db, "kullanicilar", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const bakiye = docSnap.data().bakiye;
                document.getElementById('bakiye-goster').innerText = "$" + bakiye.toFixed(2);
                
                // PARA ÇEKME
                window.paraCek = () => {
                    if(bakiye < 1000) { alert("Min. çekim $1000!"); } 
                    else { window.open(`https://wa.me/905518329861?text=Bakiye Cekme Talebi: ${docSnap.data().adSoyad}, Miktar: $${bakiye}`, '_blank'); }
                };

                // PARA YATIRMA (WhatsApp'a Yönlendirir)
                window.paraYatiritir = () => {
                    window.open(`https://wa.me/905518329861?text=Para Yatirmak Istiyorum. Isim: ${docSnap.data().adSoyad}`, '_blank');
                };
            }
        } else { window.location.href = "index.html"; }
    });
};

// ADMİN PANELİ FONKSİYONLARI
window.kullanicilariGetir = async () => {
    const liste = document.getElementById('user-list');
    const querySnapshot = await getDocs(collection(db, "kullanicilar"));
    liste.innerHTML = "";
    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const id = docSnap.id;
        liste.innerHTML += `
            <div style="border:1px solid #f39c12; margin:10px; padding:15px; border-radius:10px; background:#1a1a1a; color:white;">
                <p><b>${data.adSoyad}</b> - $${data.bakiye}</p>
                <input type="number" id="inp_${id}" style="width:70px;">
                <button onclick="bakiyeIslem('${id}', 'artir')">Ekle</button>
                <button onclick="bakiyeIslem('${id}', 'azalt')">Çıkar</button>
            </div>`;
    });
};

window.bakiyeIslem = async (id, tip) => {
    const miktar = parseFloat(document.getElementById('inp_'+id).value);
    const ref = doc(db, "kullanicilar", id);
    const snap = await getDoc(ref);
    let yeni = tip === 'artir' ? snap.data().bakiye + miktar : snap.data().bakiye - miktar;
    await updateDoc(ref, { bakiye: yeni });
    alert("Güncellendi!"); kullanicilariGetir();
};
