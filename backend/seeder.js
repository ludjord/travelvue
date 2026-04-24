require('dotenv').config();
const mysql2 = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');

// Auto-create database jika belum ada
async function createDatabaseIfNotExists() {
  const conn = await mysql2.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'travelvue_db'}\``);
  await conn.end();
  console.log(`✅ Database '${process.env.DB_NAME}' siap digunakan`);
}
const User = require('./models/User');
const Destination = require('./models/Destination');
const Package = require('./models/Package');
const Booking = require('./models/Booking');
const Testimonial = require('./models/Testimonial');

// Associations
Destination.hasMany(Package, { foreignKey: 'destination_id' });
Package.belongsTo(Destination, { foreignKey: 'destination_id' });
User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.belongsTo(User, { foreignKey: 'user_id' });
Package.hasMany(Booking, { foreignKey: 'package_id' });
Booking.belongsTo(Package, { foreignKey: 'package_id' });
User.hasMany(Testimonial, { foreignKey: 'user_id' });
Testimonial.belongsTo(User, { foreignKey: 'user_id' });
Package.hasMany(Testimonial, { foreignKey: 'package_id' });
Testimonial.belongsTo(Package, { foreignKey: 'package_id' });

async function seed() {
  await createDatabaseIfNotExists();
  await sequelize.sync({ force: true });
  console.log('🔄 Database reset...');

  // Users
  const adminPass = await bcrypt.hash('admin123', 10);
  const userPass = await bcrypt.hash('user123', 10);
  const admin = await User.create({ name: 'Admin TravelVue', email: 'admin@travelvue.com', password: adminPass, role: 'admin', phone: '08123456789' });
  const user1 = await User.create({ name: 'Budi Santoso', email: 'budi@example.com', password: userPass, role: 'user', phone: '08198765432' });
  const user2 = await User.create({ name: 'Sari Dewi', email: 'sari@example.com', password: userPass, role: 'user', phone: '08211223344' });
  console.log('✅ Users seeded');

  // Destinations
  const destinations = await Destination.bulkCreate([
    { name: 'Raja Ampat', country: 'Indonesia', city: 'Papua Barat', description: 'Surga bahari dunia dengan keindahan bawah laut yang tak tertandingi. Hamparan karang warna-warni, ikan tropis, dan pulau-pulau eksotis menjadikan Raja Ampat destinasi impian setiap penyelam di dunia.', category: 'beach', rating: 4.9, review_count: 1240, is_featured: true },
    { name: 'Bali', country: 'Indonesia', city: 'Denpasar', description: 'Pulau dewata yang memesona dengan harmoni budaya, alam, dan spiritualitas. Dari sawah berteras di Ubud, pura megah di Tanah Lot, hingga sunset di Seminyak yang memukau.', category: 'cultural', rating: 4.8, review_count: 5632, is_featured: true },
    { name: 'Labuan Bajo', country: 'Indonesia', city: 'NTT', description: 'Gerbang menuju Taman Nasional Komodo, rumah bagi kadal terbesar di dunia. Panorama laut biru kehijauan dengan pulau-pulau karst yang dramatis menjadi latar sempurna petualangan Anda.', category: 'adventure', rating: 4.8, review_count: 982, is_featured: true },
    { name: 'Yogyakarta', country: 'Indonesia', city: 'DIY', description: 'Kota budaya yang kaya warisan leluhur. Candi Borobudur dan Prambanan yang megah, seni batik yang memesona, serta kuliner khas Jawa menjadikan Yogya pengalaman tak terlupakan.', category: 'cultural', rating: 4.7, review_count: 3821, is_featured: true },
    { name: 'Lombok', country: 'Indonesia', city: 'NTB', description: 'Tetangga Bali yang masih terjaga keasliannya. Gunung Rinjani yang gagah, pantai Kuta Lombok yang pristine, dan Gili Islands yang tropis menjadi daya tarik utama pulau ini.', category: 'beach', rating: 4.7, review_count: 1543, is_featured: true },
    { name: 'Wakatobi', country: 'Indonesia', city: 'Sulawesi Tenggara', description: 'Taman Nasional laut yang diakui sebagai Pusat Segitiga Terumbu Karang Dunia. Kejernihan air dan keanekaragaman hayati lautnya menjadikan Wakatobi destinasi diving kelas dunia.', category: 'beach', rating: 4.8, review_count: 456, is_featured: false },
    { name: 'Bromo Tengger', country: 'Indonesia', city: 'Jawa Timur', description: 'Gunung berapi aktif yang ikonik dengan lautan pasir, pura Hindu, dan pemandangan sunrise terbaik di Indonesia. Suasana mistis dan dramatis membuat Bromo selalu memukau.', category: 'mountain', rating: 4.7, review_count: 2134, is_featured: false },
    { name: 'Danau Toba', country: 'Indonesia', city: 'Sumatera Utara', description: 'Danau vulkanik terbesar di dunia dengan Pulau Samosir di tengahnya. Budaya Batak yang kaya, arsitektur tradisional, dan pemandangan alam yang spektakuler menjadi daya tariknya.', category: 'nature', rating: 4.6, review_count: 1876, is_featured: false },
  ]);
  console.log('✅ Destinations seeded');

  // Packages
  const packages = await Package.bulkCreate([
    {
      destination_id: destinations[0].id,
      title: 'Raja Ampat Diving Paradise 5D4N',
      description: 'Paket diving eksklusif di surga bawah laut Raja Ampat. Nikmati keindahan terumbu karang dan biota laut yang menakjubkan bersama instruktur berpengalaman.',
      price: 8500000,
      duration: 5,
      max_people: 8,
      includes: ['Tiket pesawat PP dari Jakarta', 'Akomodasi resort bintang 4', 'Makan 3x sehari', '6x diving session', 'Perlengkapan snorkeling', 'Guide lokal', 'Transportasi lokal'],
      itinerary: [
        { day: 1, title: 'Tiba di Sorong', description: 'Penjemputan bandara, transfer ke Raja Ampat, check-in resort, welcome dinner.' },
        { day: 2, title: 'Diving di Wayag', description: 'Diving pagi dan sore di spot Wayag yang terkenal. Malam hari briefing.' },
        { day: 3, title: 'Misool Island', description: 'Snorkeling dan diving di Misool, makan siang di atas kapal.' },
        { day: 4, title: 'Pianemo & Blue Magic', description: 'Trekking ke Pianemo viewpoint, diving spot Blue Magic.' },
        { day: 5, title: 'Kepulangan', description: 'Sarapan, check-out, transfer ke Sorong, penerbangan pulang.' },
      ],
      is_featured: true,
    },
    {
      destination_id: destinations[1].id,
      title: 'Bali Honeymoon Romantic 4D3N',
      description: 'Paket honeymoon romantis di Bali. Rayakan momen spesial Anda dengan pengalaman tak terlupakan di Pulau Dewata.',
      price: 6200000,
      duration: 4,
      max_people: 2,
      includes: ['Tiket pesawat PP', 'Villa private dengan kolam renang', 'Romantic dinner', 'Spa couple 2 jam', 'City tour Ubud', 'Sunset cruise', 'Sarapan setiap hari'],
      itinerary: [
        { day: 1, title: 'Arrival & Ubud', description: 'Check-in villa, kunjungan sawah Tegalalang, makan malam romantis.' },
        { day: 2, title: 'Cultural Tour', description: 'Kunjungan Tanah Lot, Uluwatu, kecak dance di tepi tebing.' },
        { day: 3, title: 'Spa & Beach', description: 'Couple spa pagi, sore ke pantai Seminyak, sunset dinner.' },
        { day: 4, title: 'Kepulangan', description: 'Sarapan, belanja oleh-oleh, transfer bandara.' },
      ],
      is_featured: true,
    },
    {
      destination_id: destinations[2].id,
      title: 'Komodo Island Adventure 3D2N',
      description: 'Petualangan seru bertemu komodo langsung di habitatnya. Jelajahi pulau-pulau eksotis dan snorkeling di perairan kristal.',
      price: 4750000,
      duration: 3,
      max_people: 12,
      includes: ['Tiket pesawat PP dari Bali', 'Akomodasi hotel bintang 3', 'Kapal wisata private', 'Makan selama tour', 'Guide ranger Komodo', 'Snorkeling gear', 'Tiket masuk TNKS'],
      itinerary: [
        { day: 1, title: 'Tiba Labuan Bajo', description: 'Jelajahi kota, makan malam seafood di pinggir pelabuhan.' },
        { day: 2, title: 'Pulau Komodo', description: 'Trekking di Pulau Komodo, snorkeling di Pink Beach.' },
        { day: 3, title: 'Pulau Padar & Kepulangan', description: 'Sunrise di Pulau Padar, snorkeling, kembali ke Labuan Bajo.' },
      ],
      is_featured: true,
    },
    {
      destination_id: destinations[3].id,
      title: 'Yogyakarta Heritage Tour 3D2N',
      description: 'Jelajahi kekayaan budaya Jawa di Yogyakarta. Dari Candi Borobudur hingga seni batik yang autentik.',
      price: 2800000,
      duration: 3,
      max_people: 15,
      includes: ['Tiket pesawat PP', 'Hotel bintang 3 pusat kota', 'Makan 2x sehari', 'Tiket Borobudur & Prambanan', 'Tour guide', 'Workshop batik', 'Transportasi lokal'],
      itinerary: [
        { day: 1, title: 'Kraton & Malioboro', description: 'Kunjungi Kraton Yogyakarta, belanja di Malioboro, makan malam gudeg.' },
        { day: 2, title: 'Borobudur & Prambanan', description: 'Sunrise di Borobudur, siang Prambanan, sore workshop batik.' },
        { day: 3, title: 'Merapi & Kepulangan', description: 'Wisata jeep Merapi pagi, belanja oleh-oleh, transfer bandara.' },
      ],
      is_featured: true,
    },
    {
      destination_id: destinations[4].id,
      title: 'Lombok & Gili Paradise 4D3N',
      description: 'Kombinasi sempurna antara ketenangan Gili Islands dan keindahan alam Lombok. Snorkeling, diving, dan relaksasi total.',
      price: 5200000,
      duration: 4,
      max_people: 10,
      includes: ['Tiket pesawat PP dari Jakarta', 'Villa tepi pantai', 'Makan 3x sehari', 'Snorkeling trip Gili', 'Trekking Sendang Gile', 'Transportasi lokal', 'Kapal cepat Bali-Lombok'],
      itinerary: [
        { day: 1, title: 'Tiba & Gili Trawangan', description: 'Check-in, explore Gili Trawangan, sunset di tepi pantai.' },
        { day: 2, title: 'Snorkeling Gili Islands', description: 'Snorkeling di 3 Gili, makan siang di perahu.' },
        { day: 3, title: 'Lombok Selatan', description: 'Pantai Kuta Lombok, bukit Merese, Pantai Tanjung Aan.' },
        { day: 4, title: 'Kepulangan', description: 'Sarapan, oleh-oleh, transfer bandara.' },
      ],
      is_featured: true,
    },
    {
      destination_id: destinations[6].id,
      title: 'Bromo Sunrise Experience 2D1N',
      description: 'Saksikan matahari terbit paling dramatis di Indonesia dari puncak Penanjakan Bromo. Pengalaman yang akan selalu dikenang.',
      price: 1850000,
      duration: 2,
      max_people: 20,
      includes: ['Bus malam dari Surabaya', 'Penginapan di Cemoro Lawang', 'Makan 2x', 'Jeep 4x4 ke Bromo', 'Guide lokal', 'Tiket masuk'],
      itinerary: [
        { day: 1, title: 'Berangkat dari Surabaya', description: 'Keberangkatan malam hari, tiba di Cemoro Lawang dini hari.' },
        { day: 2, title: 'Sunrise & Bromo', description: 'Sunrise Penanjakan 04:00, jeep ke kawah Bromo, pulang siang.' },
      ],
      is_featured: false,
    },
  ]);
  console.log('✅ Packages seeded');

  // Bookings
  await Booking.bulkCreate([
    { user_id: user1.id, package_id: packages[0].id, travel_date: '2025-06-15', num_people: 2, total_price: 17000000, status: 'confirmed', notes: 'Kami sangat excited!' },
    { user_id: user2.id, package_id: packages[1].id, travel_date: '2025-07-20', num_people: 2, total_price: 12400000, status: 'pending', notes: 'Honeymoon kami' },
    { user_id: user1.id, package_id: packages[3].id, travel_date: '2025-05-10', num_people: 3, total_price: 8400000, status: 'completed' },
  ]);
  console.log('✅ Bookings seeded');

  // Testimonials
  await Testimonial.bulkCreate([
    { user_id: user1.id, package_id: packages[3].id, rating: 5, content: 'Perjalanan ke Yogyakarta bersama TravelVue sangat luar biasa! Guide-nya ramah, hotel nyaman, dan itinerary sangat terorganisir. Borobudur di pagi hari sungguh magical. Pasti akan pesan lagi!', is_approved: true },
    { user_id: user2.id, package_id: packages[1].id, rating: 5, content: 'Honeymoon di Bali bersama TravelVue melebihi ekspektasi kami! Villa private dengan kolam renang, makan malam romantis di tepi pantai, spa couple yang memanjakan. Terima kasih TravelVue!', is_approved: true },
    { user_id: user1.id, package_id: packages[2].id, rating: 4, content: 'Trip ke Komodo sungguh mendebarkan! Bertemu komodo langsung di habitatnya, snorkeling di Pink Beach yang cantik. Sedikit panas tapi worth it banget. Sangat merekomendasikan!', is_approved: true },
  ]);
  console.log('✅ Testimonials seeded');

  console.log('\n🎉 Seeding complete!');
  console.log('📧 Admin: admin@travelvue.com | Password: admin123');
  console.log('📧 User:  budi@example.com   | Password: user123');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
