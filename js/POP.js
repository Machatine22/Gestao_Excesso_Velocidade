document.addEventListener("DOMContentLoaded", function() {
 const modal = document.getElementById("detalhes-modal");
 const closeBtn = modal.querySelector(".close-btn");
 // Todos os botões "Detalhes"
 const detalhesBtns = document.querySelectorAll("button.Botao");
 detalhesBtns.forEach(btn => {
 if (btn.textContent.includes("Detalhes")) {
 btn.addEventListener("click", () => {
 // Aqui podes preencher dinamicamente com dados da linha
 const row = btn.closest("tr");
 if (row) {
 document.getElementById("det-matricula").innerText = row.cells[2].innerText;
 document.getElementById("det-hora").innerText = row.cells[0].innerText;
 document.getElementById("det-local").innerText = row.cells[1].innerText;
 document.getElementById("det-speed").innerText = row.cells[3].innerText + " km/h";
 document.getElementById("det-status").innerText = row.cells[4].innerText;
 // Exemplo fixo (podes depois puxar do DB):
 document.getElementById("det-infracoes").innerText = "3";
 document.getElementById("det-multa").innerText = "2,000 MZN";
 }
 modal.style.display = "flex";
 });
 }
 });
 // Fechar modal
 closeBtn.addEventListener("click", () => modal.style.display = "none");
 window.addEventListener("click", e => {
 if (e.target === modal) modal.style.display = "none";
 });
});