import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Phone, Mail, Shield, Video, Star, CheckCircle } from 'lucide-react';

const OnlineConsultation = () => {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bookingResult, setBookingResult] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        purpose: ''
    });

    const timeSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];

    useEffect(() => {
        if (selectedDate && selectedTime) {
            loadDoctors();
        }
    }, [selectedDate, selectedTime]);

    const loadDoctors = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (selectedDate) params.append('date', selectedDate);
            if (selectedTime) params.append('time', selectedTime);

            const response = await fetch(`/api/OnlineConsultation/doctors/available?${params}`);
            const data = await response.json();

            if (response.ok) {
                setDoctors(data.doctors || []);
            } else {
                console.error('Error loading doctors:', data.message);
            }
        } catch (error) {
            console.error('Error loading doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!selectedDoctor || !selectedDate || !selectedTime) {
            alert('Vui lòng chọn đầy đủ thông tin');
            return;
        }

        if (isAnonymous && (!formData.fullName || !formData.phoneNumber || !formData.email)) {
            alert('Vui lòng điền đầy đủ thông tin liên hệ');
            return;
        }

        setLoading(true);
        try {
            const bookingData = {
                doctorId: selectedDoctor.doctorID,
                appointmentDate: selectedDate,
                appointmentTime: selectedTime,
                purpose: formData.purpose || 'Tư vấn trực tuyến',
                isAnonymous: isAnonymous,
                anonymousInfo: {
                    fullName: formData.fullName,
                    phoneNumber: formData.phoneNumber,
                    email: formData.email,
                    purpose: formData.purpose
                }
            };

            const response = await fetch('/api/OnlineConsultation/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });

            const result = await response.json();

            if (result.success) {
                setBookingResult(result);
                setStep(4);
            } else {
                alert(result.message || 'Có lỗi xảy ra khi đặt lịch');
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Có lỗi xảy ra khi đặt lịch');
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
                {[1, 2, 3, 4].map((stepNumber) => (
                    <div key={stepNumber} className="flex items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= stepNumber
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}
                        >
                            {stepNumber}
                        </div>
                        {stepNumber < 4 && (
                            <div
                                className={`w-16 h-1 mx-2 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-2">
                <div className="text-sm text-gray-600 text-center">
                    {step === 1 && 'Chọn thời gian'}
                    {step === 2 && 'Chọn bác sĩ'}
                    {step === 3 && 'Thông tin liên hệ'}
                    {step === 4 && 'Hoàn thành'}
                </div>
            </div>
        </div>
    );

    if (step === 1) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
                    <div className="max-w-4xl mx-auto px-4">
                        <h1 className="text-3xl font-bold mb-2">Tư vấn trực tuyến</h1>
                        <p className="text-blue-100">Đặt lịch tư vấn với bác sĩ chuyên khoa qua video call</p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-8">
                    {renderStepIndicator()}

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Chọn ngày và giờ</h2>
                            <p className="text-gray-600">Vui lòng chọn thời gian phù hợp cho buổi tư vấn trực tuyến</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="inline w-4 h-4 mr-1" />
                                    Chọn ngày
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Clock className="inline w-4 h-4 mr-1" />
                                    Chọn giờ
                                </label>
                                <select
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">-- Chọn giờ --</option>
                                    {timeSlots.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-between">
                            <Link
                                to="/"
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Quay lại
                            </Link>
                            <button
                                onClick={() => setStep(2)}
                                disabled={!selectedDate || !selectedTime}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Tiếp tục
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
                    <div className="max-w-4xl mx-auto px-4">
                        <h1 className="text-3xl font-bold mb-2">Tư vấn trực tuyến</h1>
                        <p className="text-blue-100">Đặt lịch tư vấn với bác sĩ chuyên khoa qua video call</p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-8">
                    {renderStepIndicator()}

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Chọn bác sĩ</h2>
                            <p className="text-gray-600">
                                Ngày: <strong>{new Date(selectedDate).toLocaleDateString('vi-VN')}</strong> lúc <strong>{selectedTime}</strong>
                            </p>
                        </div>

                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Đang tải danh sách bác sĩ...</p>
                            </div>
                        ) : doctors.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600">Không có bác sĩ nào khả dụng cho thời gian này</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {doctors.map(doctor => (
                                    <div
                                        key={doctor.doctorID}
                                        className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedDoctor?.doctorID === doctor.doctorID
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => setSelectedDoctor(doctor)}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <img
                                                src={doctor.profileImage}
                                                alt={doctor.fullName}
                                                className="w-16 h-16 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = '/images/default-doctor.png';
                                                }}
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-800">{doctor.fullName}</h3>
                                                <p className="text-blue-600 text-sm">{doctor.specialty}</p>
                                                <p className="text-gray-600 text-sm mt-1">{doctor.qualification}</p>
                                                <div className="flex items-center mt-2 space-x-4">
                                                    <span className="text-sm text-gray-600">
                                                        <Star className="inline w-4 h-4 text-yellow-500 mr-1" />
                                                        Kinh nghiệm: {doctor.yearsOfExperience} năm
                                                    </span>
                                                    <span className="text-sm text-green-600 font-medium">
                                                        {doctor.consultationFee?.toLocaleString('vi-VN')} đ
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                                    <Video className="w-3 h-3 mr-1" />
                                                    Tư vấn trực tuyến
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-6 flex justify-between">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!selectedDoctor}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Tiếp tục
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
                    <div className="max-w-4xl mx-auto px-4">
                        <h1 className="text-3xl font-bold mb-2">Tư vấn trực tuyến</h1>
                        <p className="text-blue-100">Đặt lịch tư vấn với bác sĩ chuyên khoa qua video call</p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-8">
                    {renderStepIndicator()}

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thông tin liên hệ</h2>
                            <p className="text-gray-600">Điền thông tin để hoàn tất đặt lịch tư vấn trực tuyến</p>
                        </div>

                        <div className="mb-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-800 mb-2">Thông tin đã chọn:</h3>
                                <div className="text-sm text-blue-700 space-y-1">
                                    <p><Calendar className="inline w-4 h-4 mr-1" /> {new Date(selectedDate).toLocaleDateString('vi-VN')}</p>
                                    <p><Clock className="inline w-4 h-4 mr-1" /> {selectedTime}</p>
                                    <p><User className="inline w-4 h-4 mr-1" /> {selectedDoctor?.fullName} - {selectedDoctor?.specialty}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="flex items-center space-x-2 mb-4">
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <Shield className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-700">Đặt lịch ẩn danh (bảo vệ quyền riêng tư)</span>
                            </label>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Họ và tên *
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập họ và tên"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số điện thoại *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Nhập email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Lý do tư vấn
                                </label>
                                <textarea
                                    value={formData.purpose}
                                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                    rows="3"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Mô tả ngắn gọn lý do cần tư vấn..."
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-between">
                            <button
                                onClick={() => setStep(2)}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={handleBooking}
                                disabled={loading || !formData.fullName || !formData.phoneNumber || !formData.email}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Đang đặt lịch...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Xác nhận đặt lịch</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Step 4 - Success
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-2">Tư vấn trực tuyến</h1>
                    <p className="text-blue-100">Đặt lịch tư vấn với bác sĩ chuyên khoa qua video call</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {renderStepIndicator()}

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-green-800 mb-2">Đặt lịch thành công!</h2>
                        <p className="text-gray-600 mb-6">Lịch tư vấn trực tuyến của bạn đã được xác nhận</p>
                    </div>

                    {bookingResult && (
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <h3 className="font-semibold text-gray-800 mb-4">Thông tin cuộc hẹn:</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Mã lịch hẹn:</span>
                                    <span className="font-medium">#{bookingResult.appointmentId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Bác sĩ:</span>
                                    <span className="font-medium">{bookingResult.appointment.doctorName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ngày giờ:</span>
                                    <span className="font-medium">
                                        {new Date(bookingResult.appointment.appointmentDate).toLocaleDateString('vi-VN')} lúc {bookingResult.appointment.appointmentTime}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phí tư vấn:</span>
                                    <span className="font-medium text-green-600">
                                        {bookingResult.appointment.consultationFee?.toLocaleString('vi-VN')} đ
                                    </span>
                                </div>
                                <div className="border-t pt-3 mt-3">
                                    <p className="text-gray-600 mb-2">Link tham gia cuộc họp:</p>
                                    <a
                                        href={bookingResult.appointment.videoCallLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                    >
                                        <Video className="w-4 h-4 mr-2" />
                                        Tham gia cuộc họp
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-blue-800 mb-2">Lưu ý quan trọng:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Vui lòng tham gia cuộc họp đúng giờ đã hẹn</li>
                            <li>• Chuẩn bị thiết bị có camera và micro</li>
                            <li>• Kết nối internet ổn định để đảm bảo chất lượng cuộc gọi</li>
                            <li>• Lưu lại link cuộc họp để tham gia đúng giờ</li>
                        </ul>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Về trang chủ
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Xem dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnlineConsultation; 