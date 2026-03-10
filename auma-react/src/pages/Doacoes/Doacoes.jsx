import Swal from 'sweetalert2';
import QRCode from 'qrcode';
import './Doacoes.css';

export default function Doacoes() {
  const showDonationModal = () => {
    Swal.fire({
      title: 'Doe via QR Code ou Depósito',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div id="qrContainer"></div> 
          <div style="text-align: left; margin-top:20px;">
            <h4>Depósito Bancário:</h4>
            <p><strong>Banco:</strong> Banco do Brasil</p>
            <p><strong>Agência:</strong> 0001</p>
            <p><strong>Conta Corrente:</strong> 12345-6</p>
            <p><strong>CNPJ:</strong> 00.000.000/0001-00</p>
          </div>
        </div>
      `,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: 'Fechar',
      didOpen: () => {
        const qrContainer = document.getElementById('qrContainer');
        if (qrContainer) {
          QRCode.toCanvas(document.createElement('canvas'), 'Chave-PIX-AUMA-Simulada', (err, canvas) => {
            if (err) console.error(err);
            else qrContainer.appendChild(canvas);
          });
        }
      }
    });
  };

  return (
    <main className="doacoes-page">
      <div className="doacoes-content">
        <div className="doacoes-left">
          <img className="doacoes-img" src="/doe_fundo.png" alt="Desenho de uma criança" />
        </div>
        <div className="doacoes-right">
          <p>
            Sua doação transforma vidas: ajude a AUMA a oferecer terapias, apoio educacional e atividades que promovem inclusão e bem-estar para pessoas com autismo e suas famílias.
          </p>
          <button className="doe-button" onClick={showDonationModal}>
            DOE AQUI
          </button>
        </div>
      </div>
    </main>
  );
}
