import React, { useEffect, useState } from 'react';
import './HospitalFinder.css';

const HospitalFinder = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  const initMap = (latitude, longitude) => {
    const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: latitude, lng: longitude },
      zoom: 14,
    });
    setMap(mapInstance);
  };

  const findNearbyHospitals = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          initMap(latitude, longitude);

          const location = { lat: latitude, lng: longitude };
          const radius = 5000; // 5 kilometers

          const service = new window.google.maps.places.PlacesService(map);

          service.nearbySearch(
            {
              location,
              radius,
              type: ['hospital'],
            },
            (results, status) => {
              // Clear existing markers
              markers.forEach((marker) => marker.setMap(null));
              setMarkers([]);

              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                const newMarkers = results.map((hospital) => {
                  const marker = new window.google.maps.Marker({
                    position: hospital.geometry.location,
                    map,
                    title: hospital.name,
                  });

                  const infoWindow = new window.google.maps.InfoWindow({
                    content: `<h3>${hospital.name}</h3><p>${hospital.vicinity}</p>`,
                  });

                  marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                  });

                  return marker;
                });

                setMarkers(newMarkers);
              } else {
                alert('No hospitals found nearby.');
              }
            }
          );
        },
        (error) => {
          alert('Geolocation error: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log('Google Maps script loaded successfully');
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="container">
      <h1>Nearby Hospitals</h1>
      <button onClick={findNearbyHospitals} className="find-hospitals-button">
        Find Nearby Hospitals
      </button>
      <div id="map" className="map-container"></div>
    </div>
  );
};

export default HospitalFinder;
