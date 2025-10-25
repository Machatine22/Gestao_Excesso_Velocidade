const MAP_CENTER = [-25.9664, 32.5736];
const map = L.map('map', { zoomControl: true }).setView(MAP_CENTER, 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function cameraIcon(color = 'green') {
  const border = color === 'green' ? '#16a34a' : color === 'red' ? '#dc2626' : '#6b7280';
  return L.divIcon({
    className: 'camera',
    html: `
      <div style="position:relative; transform: translate(-50%, -100%);">
        <div class="camera-emoji">📷</div>
        <div style="position:absolute; left:50%; top:100%; transform:translate(-50%, 4px); width:10px; height:10px; background:${border}; border:2px solid white; border-radius:50%; box-shadow:0 1px 2px rgba(0,0,0,.25);"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -28]
  });
}

const cameraMarkers = new Map();

async function getLocationName(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
    const res = await fetch(url, { headers: { "User-Agent": "SpeedCamDashboard/1.0" }});
    const data = await res.json();
    return data.address.suburb || data.address.neighbourhood || data.address.city || "Unknown location";
  } catch {
    return "Unknown location";
  }
}

async function upsertCamera(cam) {
  const { id, lat, lng, speed = null, status = 'unknown', last_seen = Date.now() } = cam;
  const color = status === 'active' ? 'green' : status === 'offline' ? 'red' : 'gray';
  const locationName = await getLocationName(lat, lng);

  const popupHtml = `
    <div style="font: 14px system-ui, -apple-system, Segoe UI, Roboto, Arial; min-width:200px">
      <strong>Speed Camera #${id}</strong><br/>
      <small>${new Date(last_seen).toLocaleString()}</small><br/>
      <div style="margin-top:6px">
        <div>Status: <strong style="text-transform:capitalize">${status}</strong></div>
        <div>Recorded speed: <strong>${speed ?? '—'}</strong> km/h</div>
        <div>Nr de veiculos: <strong>${speed ?? '—'}</strong> km/h</div>\n
                         <div>Nr de infracoes: <strong>${speed ?? '—'}</strong> km/h</div>\n
                                   <div> Velocidade media: <strong>${speed ?? '—'}</strong> km/h</div>\n 
                                   
        <div>Location: ${locationName}</div>
        <div><button>Detalhes</button></div>
      </div>
    </div>`;

  if (cameraMarkers.has(id)) {
    const marker = cameraMarkers.get(id);
    marker.setLatLng([lat, lng]);
    marker.setIcon(cameraIcon(color));
    marker.setPopupContent(popupHtml);
  } else {
    const marker = L.marker([lat, lng], { icon: cameraIcon(color) }).addTo(map);
    marker.bindPopup(popupHtml);
    cameraMarkers.set(id, marker);
  }
}

function fitToCameras() {
  if (cameraMarkers.size === 0) return;
  const group = L.featureGroup([...cameraMarkers.values()]);
  map.fitBounds(group.getBounds().pad(0.2));
}

document.getElementById('fitBounds').addEventListener('click', fitToCameras);

// Exemplo: insere câmeras fixas
[
  { id: 101, lat: -25.965, lng: 32.589, status: 'active', speed: 72 },
  { id: 102, lat: -25.978, lng: 32.561, status: 'unknown' },
  { id: 103, lat: -25.953, lng: 32.575, status: 'offline' }
].forEach(upsertCamera);
