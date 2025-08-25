import React, { useState } from 'react';
import './css/CarList.css';
import { useNavigate } from 'react-router-dom'; // Add this

const CarList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Add this

  const cars = [
    // Expensive
    { category: 'Expensive', name: 'Tesla Model S', pricePerMonth: 3500, colors: ['black', 'white', 'red'], available: true },
    { category: 'Expensive', name: 'BMW 7 Series', pricePerMonth: 3200, colors: ['black', 'blue', 'silver'], available: true },
    { category: 'Expensive', name: 'Mercedes-Benz S-Class', pricePerMonth: 3400, colors: ['white', 'silver'], available: true },
    { category: 'Expensive', name: 'Audi A8', pricePerMonth: 3300, colors: ['black', 'grey'], available: true },
    { category: 'Expensive', name: 'Lexus LS', pricePerMonth: 3100, colors: ['red', 'white', 'black'], available: true },

    // Mid-Range
    { category: 'Mid-Range', name: 'Toyota Camry', pricePerMonth: 1800, colors: ['white', 'grey', 'black'], available: true },
    { category: 'Mid-Range', name: 'Honda Accord', pricePerMonth: 1700, colors: ['black', 'blue'], available: true },
    { category: 'Mid-Range', name: 'Mazda 6', pricePerMonth: 1600, colors: ['red', 'grey'], available: true },
    { category: 'Mid-Range', name: 'Nissan Altima', pricePerMonth: 1650, colors: ['white', 'black'], available: true },
    { category: 'Mid-Range', name: 'Hyundai Sonata', pricePerMonth: 1550, colors: ['silver', 'black'], available: true },

    // Everyday
    { category: 'Everyday', name: 'Toyota Corolla', pricePerMonth: 1100, colors: ['white', 'silver', 'blue'], available: true },
    { category: 'Everyday', name: 'Honda Civic', pricePerMonth: 1050, colors: ['black', 'red'], available: true },
    { category: 'Everyday', name: 'Hyundai Elantra', pricePerMonth: 1000, colors: ['blue', 'grey'], available: true },
    { category: 'Everyday', name: 'Kia Forte', pricePerMonth: 950, colors: ['black', 'silver'], available: true },
    { category: 'Everyday', name: 'Nissan Versa', pricePerMonth: 900, colors: ['white', 'red'], available: true },
  ];

  const handleBookNow = (car) => {
    navigate('/book', { state: { car } }); // Navigate with car data
  };

  const grouped = { Expensive: [], 'Mid-Range': [], Everyday: [] };
  cars.forEach((car) => {
    if (car.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      grouped[car.category].push(car);
    }
  });

  return (
    <div className="container my-5 car-list">
      <h2 className="text-center mb-4">Available Cars in Bangladesh</h2>

      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <input
            type="text"
            placeholder="Search by car name..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {Object.entries(grouped).map(([category, carGroup]) =>
        carGroup.length > 0 ? (
          <div key={category}>
            <h4 className="text-center mb-3">{category} Cars</h4>
            <div className="row">
              {carGroup.map((car, index) => (
                <div className="col-md-4 mb-4" key={index}>
                  <div className="card shadow-sm p-3 car-box">
                    <h5 className="car-name">{car.name}</h5>
                    <p className="car-price">
                      Monthly: ${car.pricePerMonth}<br />
                      15 Days: ${(car.pricePerMonth / 2).toFixed(0)}
                    </p>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      {car.colors.map((color, i) => (
                        <span
                          key={i}
                          className="color-swatch"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <span className={`badge ${car.available ? 'bg-success' : 'bg-secondary'} mb-3`}>
                      {car.available ? 'Available' : 'Not Available'}
                    </span>
                    <button
                      className="btn btn-primary w-100"
                      disabled={!car.available}
                      onClick={() => handleBookNow(car)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};

export default CarList;
