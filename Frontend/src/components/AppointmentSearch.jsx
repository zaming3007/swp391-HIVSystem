import React, { useState } from 'react';
import { Search, Calendar, Clock, User, Video, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

const AppointmentSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            alert('Vui lòng nhập số điện thoại hoặc email');
            return;
        }

        setLoading(true);
        setHasSearched(true);

        try {
            const response = await fetch(`/api/OnlineConsultation/search?contact=${encodeURIComponent(searchQuery.trim())}`);
            const data = await response.json();

            if (response.ok) {
                setSearchResults(data.appointments || []);
            } else {
                console.error('Search error:', data.message);
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'Đã hẹn': { bg: 'bg-blue-100', text: 'text-blue-800' },
            'Hoàn thành': { bg: 'bg-green-100', text: 'text-green-800' },
            'Đã hủy': { bg: 'bg-red-100', text: 'text-red-800' },
            'Không đến': { bg: 'bg-gray-100', text: 'text-gray-800' }
        };

        const colors = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                {status}
            </span>
        );
    };

    const formatCurrency = (amount) => {
        return amount ? amount.toLocaleString('vi-VN') + ' đ' : 'Miễn phí';
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Tra cứu lịch hẹn</h3>
                <p className="text-gray-600 text-sm">Nhập số điện thoại hoặc email để tìm kiếm lịch hẹn của bạn</p>
            </div>

            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Nhập số điện thoại hoặc email..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Tìm...</span>
                            </>
                        ) : (
                            <>
                                <Search className="w-4 h-4" />
                                <span>Tìm kiếm</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Search Results */}
            {hasSearched && (
                <div className="border-t pt-6">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Đang tìm kiếm...</p>
                        </div>
                    ) : searchResults.length === 0 ? (
                        <div className="text-center py-8">
                            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Không tìm thấy lịch hẹn nào</p>
                            <p className="text-gray-400 text-sm mt-1">Vui lòng kiểm tra lại thông tin liên hệ</p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-medium text-gray-800">
                                    Tìm thấy {searchResults.length} lịch hẹn
                                </h4>
                                <button
                                    onClick={() => {
                                        setHasSearched(false);
                                        setSearchResults([]);
                                        setSearchQuery('');
                                    }}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    Xóa kết quả
                                </button>
                            </div>

                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {searchResults.map((appointment, index) => (
                                    <div
                                        key={appointment.appointmentID}
                                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                {appointment.isOnline ? (
                                                    <Video className="w-4 h-4 text-purple-600" />
                                                ) : (
                                                    <MapPin className="w-4 h-4 text-blue-600" />
                                                )}
                                                <span className={`text-sm font-medium ${appointment.isOnline ? 'text-purple-600' : 'text-blue-600'
                                                    }`}>
                                                    {appointment.type}
                                                </span>
                                            </div>
                                            {getStatusBadge(appointment.status)}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600">Bác sĩ:</span>
                                                    <span className="font-medium">{appointment.doctorName}</span>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600">Ngày:</span>
                                                    <span className="font-medium">{appointment.appointmentDate}</span>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600">Giờ:</span>
                                                    <span className="font-medium">{appointment.appointmentTime}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600">Địa điểm:</span>
                                                    <span className="font-medium text-xs">{appointment.facilityName}</span>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-600">Phí:</span>
                                                    <span className="font-medium text-green-600">
                                                        {formatCurrency(appointment.consultationFee)}
                                                    </span>
                                                </div>

                                                {appointment.purpose && (
                                                    <div className="text-gray-600 text-xs">
                                                        <span className="font-medium">Lý do:</span> {appointment.purpose}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Video Call Link for Online Consultations */}
                                        {appointment.isOnline && appointment.canJoinCall && appointment.videoCallLink && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">Link cuộc họp:</span>
                                                    <a
                                                        href={appointment.videoCallLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                                                    >
                                                        <Video className="w-3 h-3 mr-1" />
                                                        Tham gia
                                                        <ExternalLink className="w-3 h-3 ml-1" />
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* Contact Info Preview */}
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <User className="w-3 h-3" />
                                                    <span>{appointment.patientName}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <span>ID:</span>
                                                    <span className="font-mono">#{appointment.appointmentID}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AppointmentSearch; 