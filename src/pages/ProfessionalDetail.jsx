// src/pages/ProfessionalDetail.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllProfessionals } from '../data.js';
import StarRating from '../components/StarRating.jsx';

const ProfessionalDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Load professional data
    const allProfessionals = getAllProfessionals();
    const professional = allProfessionals.find(p => p.id === parseInt(id));

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    const avatarFallback = "/avatar.svg";
    const upiQR = "/im1.png"; // reuse existing public image as UPI placeholder

    if (!professional) {
        return (
            <div className="main-content" style={{ textAlign: "center", padding: "50px" }}>
                <h2 style={{ color: "red" }}>Professional Not Found</h2>
                <p>The requested profile does not exist.</p>
                <button onClick={() => navigate('/')} className="signin-btn" style={{ marginTop: '20px' }}>
                    Back Home
                </button>
            </div>
        );
    }

    const handleBookingClick = () => {
        if (!currentUser || !currentUser.isLoggedIn) {
            alert("Please sign in to continue with booking.");
            navigate("/signin");
        } else {
            setIsModalOpen(true);
        }
    };

    const handleConfirmBooking = () => {
        const record = {
            proId: professional.id,
            proName: professional.name,
            service: professional.profession,
            rate: professional.rate,
            date: new Date().toLocaleDateString("en-IN"),
            status: "Completed",
        };

        const key = `bookingHistory_${currentUser.email}`;
        const history = JSON.parse(localStorage.getItem(key) || "[]");
        history.push(record);
        localStorage.setItem(key, JSON.stringify(history));

        alert(`Payment ₹${professional.rate} simulated successfully!`);
        setIsModalOpen(false);
    };

    return (
        <div className="main-content" style={{ maxWidth: "900px", marginBottom: "50px" }}>
            
            <button 
                onClick={() => navigate(-1)} 
                className="signin-btn" 
                style={{ backgroundColor: "var(--surface)", marginBottom: "20px", color: 'var(--text)' }}>
                ← Back
            </button>

            <div style={{
                background: "var(--surface)",
                padding: "30px",
                borderRadius: "14px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
            }}>
                <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
                    
                    {/* Profile Image */}
                    <div style={{ textAlign: "center" }}>
                        <img
                            src={professional.image || avatarFallback}
                            alt={professional.name}
                            style={{
                                width: "220px",
                                height: "220px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "4px solid var(--primary)"
                            }}
                            onError={(e)=>{e.target.onerror=null; e.target.src = avatarFallback}}
                        />

                        <div style={{ marginTop: "10px" }}>
                            <StarRating rating={professional.rating} />
                            <p style={{ marginTop: 5, color: "var(--muted)" }}>
                                ({professional.rating} / 5.0)
                            </p>
                        </div>

                        {professional.isVerified && (
                            <div style={{
                                marginTop: "8px",
                                backgroundColor: "var(--success-bg)",
                                padding: "5px 10px",
                                borderRadius: "6px",
                                display: "inline-block",
                                color: "var(--success)",
                                fontSize: "14px",
                                fontWeight: "bold"
                            }}>
                                ✓ Verified
                            </div>
                        )}
                    </div>

                    {/* Profile Text Details */}
                    <div style={{ flexGrow: 1 }}>
                        <h1 style={{
                            fontSize: "32px",
                            color: "var(--text)",
                            marginBottom: "5px"
                        }}>
                            {professional.name}
                        </h1>

                        <p style={{
                            fontSize: "19px",
                            fontWeight: "bold",
                            color: "var(--primary)",
                            margin: "5px 0 15px"
                        }}>
                            {professional.profession}
                        </p>

                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            marginBottom: "20px"
                        }}>
                            {professional.skills.map((s, i) => (
                                <span key={i} style={{
                                    background: "var(--tag-bg)",
                                    padding: "5px 10px",
                                    borderRadius: "6px",
                                    fontSize: "13px",
                                    color: "var(--primary-600)",
                                    fontWeight: 600
                                }}>
                                    {s}
                                </span>
                            ))}
                        </div>

                        <p style={{ color: "var(--muted)", lineHeight: "1.6", marginBottom: "25px" }}>
                            {professional.desc}
                        </p>

                        <div style={{
                            border: "1px solid var(--primary)",
                            padding: "15px",
                            borderRadius: "12px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap"
                        }}>
                            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                                Price: <span style={{ color: "var(--danger)" }}>₹{professional.rate}/hr</span>
                            </span>

                            <button 
                                className="hire-btn"
                                onClick={handleBookingClick}
                                style={{ fontSize: "18px", padding: "10px 28px" }}>
                                Book Service
                            </button>
                        </div>
                    </div>

                </div>
            </div>


            {/* Payment Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Booking & Payment</h3>
                        <p>You are booking for one hour.</p>

                        <div className="summary-box">
                            <p><strong>Service:</strong> {professional.profession}</p>
                            <p><strong>Amount:</strong> ₹{professional.rate}</p>
                        </div>

                        <div style={{ textAlign: "center", margin: "15px 0" }}>
                            <img
                                src={upiQR}
                                alt="UPI QR Code"
                                style={{
                                    width: "200px",
                                    height: "200px",
                                    border: "2px solid rgba(255,255,255,0.08)",
                                    borderRadius: "10px"
                                }}
                            />
                            <p style={{ fontSize: "13px", color: "var(--danger)", marginTop: "8px" }}>
                                *Simulated Test Payment Only*
                            </p>
                        </div>

                        <div className="modal-actions">
                                <button onClick={() => setIsModalOpen(false)} style={{ backgroundColor: "#aaa" }}>
                                Cancel
                            </button>
                            <button onClick={handleConfirmBooking} style={{ backgroundColor: "var(--success)" }}>
                                Confirm Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProfessionalDetail;
