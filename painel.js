// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCKuUXH4pamqh_tI84QEQtwi4...seu código...",
  authDomain: "magno-tech.firebaseapp.com",
  projectId: "magno-tech",
  storageBucket: "magno-tech.appspot.com",
  messagingSenderId: "934248409336",
  appId: "1:934248409336:web:966cc48713..."
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Login administrador
function loginAdmin(email, senha) {
  auth.signInWithEmailAndPassword(email, senha)
    .then(() => {
      alert("Login realizado com sucesso!");
      document.getElementById("form-login").style.display = "none";
      document.getElementById("painel").style.display = "block";
      carregarModelos();
    })
    .catch(error => {
      alert("Erro no login: " + error.message);
    });
}

// Enviar modelo para Firestore
function salvarModelo(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const preco = document.getElementById("preco").value;
  const imagem = document.getElementById("imagem").value;
  const descricao = document.getElementById("descricao").value;

  db.collection("modelos").add({
    nome,
    preco,
    imagem,
    descricao,
    criadoEm: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert("Modelo cadastrado!");
    document.getElementById("form-modelo").reset();
    carregarModelos();
  }).catch(error => {
    alert("Erro ao salvar modelo: " + error.message);
  });
}

// Carregar modelos
function carregarModelos() {
  const lista = document.getElementById("lista-modelos");
  lista.innerHTML = "";

  db.collection("modelos").orderBy("criadoEm", "desc").get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data();
        const item = document.createElement("div");
        item.innerHTML = `
          <strong>${data.nome}</strong><br>
          R$ ${data.preco}<br>
          <img src="${data.imagem}" width="120"/><br>
          <em>${data.descricao}</em><br>
          <button onclick="deletarModelo('${doc.id}')">Deletar</button>
          <hr>
        `;
        lista.appendChild(item);
      });
    });
}

// Deletar modelo
function deletarModelo(id) {
  if (confirm("Tem certeza que deseja excluir este modelo?")) {
    db.collection("modelos").doc(id).delete()
      .then(() => {
        alert("Modelo excluído!");
        carregarModelos();
      });
  }
}

// Eventos
document.getElementById("form-modelo").addEventListener("submit", salvarModelo);
document.getElementById("form-login").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  loginAdmin(email, senha);
});
