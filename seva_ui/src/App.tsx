
import { useState, useEffect } from 'react';
import {
    Typography, Container, Box, Grid, Card, CardContent, Drawer,
    List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, CssBaseline,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Checkbox, FormControlLabel, IconButton, Avatar,
    Select, InputLabel, MenuItem, FormControl, Switch
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HotelIcon from '@mui/icons-material/Hotel';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FeedbackIcon from '@mui/icons-material/Feedback';
import MapIcon from '@mui/icons-material/Map';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';



import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


// --- Constants ---
const drawerWidth = 240;
const API_URL = `http://${window.location.hostname}:8080/api`;

// --- Interfaces ---
interface User {
    id?: number;
    name: string;
    mobileNumber: string;
    email: string;
    address: string;
    role: 'USER' | 'ADMIN' | 'VOLUNTEER';
    volunteer: boolean;
    volunteerStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
    consentDataStorage: boolean;
    consentCommunications: boolean;
}

interface News {
    id?: number;
    title: string;
    titleKa?: string;
    content: string;
    contentKa?: string;
    imageUrl?: string;
    flashUpdate: boolean;
    publishedAt?: string;
}

interface Event {
    id?: number;
    title: string;
    description: string;
    eventDate: string;
    eventTime?: string;
    location: string;
}

interface GalleryItem {
    id?: number;
    title: string;
    imageUrl: string;
    category?: string;
}

interface Seva {
    id?: number;
    name: string;
    nameKa?: string;
    description: string;
    descriptionKa?: string;
    amount: number;
    type: string;
    active: boolean;
    location: string;
}

interface RoomBooking {
    id: number;
    devoteeName: string;
    mobileNumber: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfRooms: number;
    roomType: 'AC' | 'Non-AC';
    adults: number;
    children: number;
    aadhaar: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
    idProofUrl?: string;
}

interface AdminNotification {
    type: string;
    message: string;
    timestamp: number;
}

// Mock Data for History and Branches
// History & Parampara Interfaces
interface HistoryData { id: number; contentEn: string; contentKa: string; }
interface Parampara {
    id: number; name: string; period: string; guru: string; shishya: string;
    vrindavanaLocation: string; vrindavanaUrl: string; photoUrl: string;
    descriptionEn: string; descriptionKa: string;
}
interface Bhootarajaru {
    id: number;
    name: string;
    descriptionEn: string;
    descriptionKa: string;
    image?: string;
}

interface AppConfig {
    configKey: string;
    configValue: string;
    enabled: boolean;
}

interface AnalyticsData {
    seva_weekly: { name: string; bookings: number; amount: number }[];
    donations_monthly: { name: string; amount: number }[];
}

interface Branch {
    id: number;
    name: string;
    nameKa?: string;
    location: string;
    locationKa?: string;
    contact: string;
    email?: string;
    mapUrl?: string;
    imageUrl?: string;
}

interface Donation {
    id: number;
    donorName: string;
    donorEmail: string;
    purpose: string;
    amount: number;
    transactionId: string;
    status: string;
    timestamp: string;
}

interface DevoteeVisit {
    id: number;
    devoteeName: string;
    mobileNumber: string;
    place: string;
    numberOfPeople: number;
    visitDate: string;
    registrationTime: string;
}

interface SevaBooking {
    id: number;
    user: User;
    seva: Seva;
    bookingDate: string;
    sankalpaDetails: string;
    transactionId: string;
    status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
    rejectionReason?: string;
}

interface Institution {
    id: number;
    name: string;
    location: string;
    website: string;
    contact: string;
    tagline?: string;
}

interface LiteraryWork {
    id: number;
    title: string;
    titleKa: string;
    category: string;
    description: string;
    url?: string;
}

interface Miracle {
    id: number;
    title: string;
    titleKa: string;
    descriptionEn: string;
    descriptionKa: string;
}

interface RenovationUpdate {
    id: number;
    title: string;
    description: string;
    targetAmount: number;
    collectedAmount: number;
    contributorsCount: number;
    status: 'ONGOING' | 'COMPLETED';
}

interface Video {
    id: number;
    title: string;
    titleKa: string;
    category: string;
    videoUrl: string;
    thumbnailUrl: string;
}

interface PlaceToVisit {
    id?: number;
    name: string;
    nameKa: string;
    descriptionEn: string;
    descriptionKa: string;
    imageUrl: string;
    mapUrl: string;
    distance: string;
}

interface QuizQuestion {
    id?: number;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
    language: string;
}

function App() {
    const [currentTab, setCurrentTab] = useState('Dashboard');

    // Data State
    const [users, setUsers] = useState<User[]>([]);
    const [news, setNews] = useState<News[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [sevas, setSevas] = useState<Seva[]>([]);
    const [roomBookings, setRoomBookings] = useState<RoomBooking[]>([]);
    const [sevaBookings, setSevaBookings] = useState<SevaBooking[]>([]);
    const [historyData, setHistoryData] = useState<HistoryData>({ id: 0, contentEn: '', contentKa: '' });
    const [paramparaList, setParamparaList] = useState<Parampara[]>([]);
    const [bhootarajaruList, setBhootarajaruList] = useState<Bhootarajaru[]>([]);
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [literaryWorks, setLiteraryWorks] = useState<LiteraryWork[]>([]);
    const [miracles, setMiracles] = useState<Miracle[]>([]);
    const [renovationUpdates, setRenovationUpdates] = useState<RenovationUpdate[]>([]);
    const [videos, setVideos] = useState<Video[]>([]);
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [placesToVisit, setPlacesToVisit] = useState<PlaceToVisit[]>([]);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [visits, setVisits] = useState<DevoteeVisit[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dialog State
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [openNewsDialog, setOpenNewsDialog] = useState(false);
    const [openEventDialog, setOpenEventDialog] = useState(false);
    const [openGalleryDialog, setOpenGalleryDialog] = useState(false);
    const [openSevaDialog, setOpenSevaDialog] = useState(false);
    const [openParamparaDialog, setOpenParamparaDialog] = useState(false);
    const [openBhootarajaruDialog, setOpenBhootarajaruDialog] = useState(false);
    const [openBranchDialog, setOpenBranchDialog] = useState(false);
    const [openInstitutionDialog, setOpenInstitutionDialog] = useState(false);
    const [openLiteraryDialog, setOpenLiteraryDialog] = useState(false);
    const [openMiracleDialog, setOpenMiracleDialog] = useState(false);
    const [openRenovationDialog, setOpenRenovationDialog] = useState(false);
    const [openVideoDialog, setOpenVideoDialog] = useState(false);
    const [openPlaceDialog, setOpenPlaceDialog] = useState(false);

    // Form State
    const [newUser, setNewUser] = useState<User>({
        name: '', mobileNumber: '', email: '', address: '', role: 'USER',
        volunteer: false, consentDataStorage: true, consentCommunications: true
    });
    const [newNews, setNewNews] = useState<News>({
        title: '', titleKa: '', content: '', contentKa: '', flashUpdate: false, imageUrl: ''
    });
    const [newEvent, setNewEvent] = useState<Event>({
        title: '', description: '', eventDate: '', location: 'Sode Matha'
    });
    const [newGalleryItem, setNewGalleryItem] = useState<GalleryItem>({
        title: '', imageUrl: '', category: 'Deity'
    });
    const [newSeva, setNewSeva] = useState<Seva>({
        id: 0, name: '', nameKa: '', description: '', descriptionKa: '', amount: 0, type: 'POOJA', active: true, location: 'SODE'
    });
    const [newPlace, setNewPlace] = useState<PlaceToVisit>({
        name: '', nameKa: '', descriptionEn: '', descriptionKa: '', imageUrl: '', mapUrl: '', distance: ''
    });

    // New/Edit State for Parampara
    const [newParampara, setNewParampara] = useState<Parampara>({
        id: 0, name: '', period: '', guru: '', shishya: '',
        vrindavanaLocation: '', vrindavanaUrl: '', photoUrl: '',
        descriptionEn: '', descriptionKa: ''
    });
    const [newBranch, setNewBranch] = useState<Branch>({ id: 0, name: '', nameKa: '', location: '', locationKa: '', contact: '', email: '', mapUrl: '', imageUrl: '' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [newBhootarajaru, setNewBhootarajaru] = useState<Bhootarajaru>({
        id: 0, name: '', descriptionEn: '', descriptionKa: ''
    });

    // New Form States
    const [newInstitution, setNewInstitution] = useState<Institution>({ id: 0, name: '', location: '', website: '', contact: '' });
    const [newLiteraryWork, setNewLiteraryWork] = useState<LiteraryWork>({ id: 0, title: '', titleKa: '', category: '', description: '' });
    const [newMiracle, setNewMiracle] = useState<Miracle>({ id: 0, title: '', titleKa: '', descriptionEn: '', descriptionKa: '' });
    const [newRenovation, setNewRenovation] = useState<RenovationUpdate>({ id: 0, title: '', description: '', targetAmount: 0, collectedAmount: 0, contributorsCount: 0, status: 'ONGOING' });
    const [newVideo, setNewVideo] = useState<Video>({ id: 0, title: '', titleKa: '', category: '', videoUrl: '', thumbnailUrl: '' });
    const [openQuizDialog, setOpenQuizDialog] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [newQuestion, setNewQuestion] = useState<QuizQuestion>({
        question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', language: 'EN'
    });

    const [appConfigs, setAppConfigs] = useState<AppConfig[]>([]);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        console.log('App mounted, fetching data...');
        fetchUsers();
        fetchNews();
        fetchEvents();
        fetchGallery();
        fetchSevas();
        fetchRoomBookings();
        fetchSevaBookings();
        fetchHistory();
        fetchParampara();
        fetchBhootarajaru();
        fetchAppConfigs();
        fetchAnalytics();
        fetchNotifications();
        fetchInstitutions();
        fetchLiteraryWorks();
        fetchMiracles();
        fetchRenovationUpdates();
        fetchVideos();
        fetchPlacesToVisit();
        fetchQuizQuestions();
        fetchDonations();
        fetchBranches();
        fetchVisits();

        // Polling for notifications
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchAppConfigs = async () => {
        try {
            // First try to init defaults
            await fetch(`${API_URL}/config/init`, { method: 'POST' });
            const res = await fetch(`${API_URL}/config`);
            if (res.ok) setAppConfigs(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchAnalytics = async () => {
        try {
            const res = await fetch(`${API_URL}/analytics/dashboard`);
            if (res.ok) setAnalyticsData(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${API_URL}/notifications/admin`);
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.sort((a: any, b: any) => b.timestamp - a.timestamp));
            }
        } catch (e) { console.error(e); }
    };

    const handleToggleConfig = async (config: AppConfig) => {
        try {
            const updated = { ...config, enabled: !config.enabled };
            await fetch(`${API_URL}/config/${config.configKey}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            });
            fetchAppConfigs();
        } catch (e) { console.error(e); }
    };

    // --- API Calls ---
    const fetchUsers = async () => {
        try {
            console.log('Fetching users...');
            const res = await fetch(`${API_URL}/users`);
            if (res.ok) {
                const data = await res.json();
                setUsers(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users');
        }
    };

    const fetchNews = async () => {
        try {
            console.log('Fetching news...');
            const res = await fetch(`${API_URL}/news`);
            if (res.ok) {
                const data = await res.json();
                setNews(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error('Error fetching news:', err);
            setError('Failed to fetch news');
        }
    };

    const fetchEvents = async () => {
        try {
            console.log('Fetching events...');
            const res = await fetch(`${API_URL}/events`);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length === 0) {
                    setEvents([
                        { id: 1, title: 'Sri Vadiraja Jayanthi', description: 'Grand celebration of Sri Vadiraja Teertha Swamiji Jayanthi.', eventDate: '2024-02-23', location: 'Sode Matha' },
                        { id: 2, title: 'Aradhana Mahotsava', description: 'Annual Aradhana celebrations with special poojas.', eventDate: '2024-03-15', location: 'Sode Matha' },
                        { id: 3, title: 'Laksha Deepotsava', description: 'Lighting of one lakh lamps in the holy precincts.', eventDate: '2024-11-23', location: 'Udupi Krishna Matha' }
                    ]);
                } else {
                    setEvents(Array.isArray(data) ? data : []);
                }
            }
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Failed to fetch events');
        }
    };

    const fetchGallery = async () => {
        try {
            console.log('Fetching gallery...');
            const res = await fetch(`${API_URL}/gallery`);
            if (res.ok) {
                const data = await res.json();
                setGalleryItems(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error('Error fetching gallery:', err);
            setError('Failed to fetch gallery');
        }
    };

    const fetchSevas = async () => {
        try {
            const res = await fetch(`${API_URL}/sevas`);
            if (res.ok) {
                const data = await res.json();
                setSevas(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error('Error fetching sevas:', err);
        }
    };

    const fetchRoomBookings = async () => {
        try {
            const res = await fetch(`${API_URL}/rooms`);
            if (res.ok) {
                const data = await res.json();
                setRoomBookings(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error('Error fetching room bookings:', err);
        }
    };

    const fetchSevaBookings = async () => {
        try {
            const res = await fetch(`${API_URL}/seva-bookings`);
            if (res.ok) {
                const data = await res.json();
                setSevaBookings(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error('Error fetching seva bookings:', err);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await fetch(`${API_URL}/history`);
            if (res.ok) setHistoryData(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchParampara = async () => {
        try {
            const res = await fetch(`${API_URL}/parampara`);
            if (res.ok) setParamparaList(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchBhootarajaru = async () => {
        try {
            const res = await fetch(`${API_URL}/bhootarajaru`);
            if (res.ok) setBhootarajaruList(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchInstitutions = async () => {
        try {
            const res = await fetch(`${API_URL}/institutions`);
            if (res.ok) setInstitutions(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchLiteraryWorks = async () => {
        try {
            const res = await fetch(`${API_URL}/literary-works`);
            if (res.ok) setLiteraryWorks(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchMiracles = async () => {
        try {
            const res = await fetch(`${API_URL}/miracles`);
            if (res.ok) setMiracles(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchRenovationUpdates = async () => {
        try {
            const res = await fetch(`${API_URL}/renovation`);
            if (res.ok) setRenovationUpdates(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchVideos = async () => {
        try {
            const res = await fetch(`${API_URL}/videos`);
            if (res.ok) setVideos(await res.json());
        } catch (e) { console.error(e); }
    };
    const fetchPlacesToVisit = async () => {
        try {
            const res = await fetch(`${API_URL}/places`);
            if (res.ok) setPlacesToVisit(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchQuizQuestions = async () => {
        try {
            const res = await fetch(`${API_URL}/quiz/all-questions`);
            if (res.ok) setQuizQuestions(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchDonations = async () => {
        try {
            const res = await fetch(`${API_URL}/donations`);
            if (res.ok) setDonations(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchVisits = async () => {
        try {
            const res = await fetch(`${API_URL}/visits`);
            if (res.ok) setVisits(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchBranches = async () => {
        try {
            const res = await fetch(`${API_URL}/branches`);
            if (res.ok) setBranches(await res.json());
        } catch (e) { console.error(e); }
    };

    const handleSaveSeva = async () => {
        setLoading(true);
        try {
            const method = newSeva.id ? 'PUT' : 'POST';
            const url = newSeva.id ? `${API_URL}/sevas/${newSeva.id}` : `${API_URL}/sevas`;
            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSeva)
            });
            setOpenSevaDialog(false);
            fetchSevas();
            setNewSeva({ id: 0, name: '', nameKa: '', description: '', descriptionKa: '', amount: 0, type: 'POOJA', active: true, location: 'SODE' });
        } catch (err) {
            console.error('Error saving seva:', err);
            alert('Failed to save seva');
        }
        setLoading(false);
    };

    const handleSaveUser = async () => {
        if (!newUser.name || !newUser.mobileNumber) {
            alert('Please fill in all required fields (Name and Mobile Number)');
            return;
        }
        if (newUser.mobileNumber.length !== 10 || !/^\d+$/.test(newUser.mobileNumber)) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const isEdit = !!newUser.id;
            const url = isEdit ? `${API_URL}/users/${newUser.id}` : `${API_URL}/users`;
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Failed to ${isEdit ? 'update' : 'create'} user`);
            }
            const savedUser = await response.json();
            setOpenUserDialog(false);
            setNewUser({
                name: '', mobileNumber: '', email: '', address: '', role: 'USER',
                volunteer: false, consentDataStorage: true, consentCommunications: true
            });
            await fetchUsers();
            alert(`Devotee "${savedUser.name}" ${isEdit ? 'updated' : 'registered'} successfully!`);
        } catch (err: any) {
            console.error(`Error ${newUser.id ? 'updating' : 'creating'} user:`, err);
            setError(err.message || `Failed to ${newUser.id ? 'update' : 'create'} devotee`);
            alert(err.message || `Failed to ${newUser.id ? 'update' : 'create'} devotee. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this devotee?')) return;
        try {
            await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
            fetchUsers();
        } catch (e) { console.error(e); }
    };

    const handleSaveBranch = async () => {
        setLoading(true);
        try {
            const method = newBranch.id ? 'PUT' : 'POST';
            const url = newBranch.id ? `${API_URL}/branches/${newBranch.id}` : `${API_URL}/branches`;
            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBranch)
            });
            setOpenBranchDialog(false);
            fetchBranches();
            setNewBranch({ id: 0, name: '', nameKa: '', location: '', locationKa: '', contact: '', email: '', mapUrl: '', imageUrl: '' });
        } catch (err) {
            console.error('Error saving branch:', err);
            alert('Failed to save branch');
        }
        setLoading(false);
    };

    const handleDeleteBranch = async (id: number) => {
        if (!window.confirm("Delete this branch?")) return;
        try {
            await fetch(`${API_URL}/branches/${id}`, { method: 'DELETE' });
            fetchBranches();
        } catch (e) { alert("Failed to delete branch"); }
    };

    const handleCreateNews = async () => {
        setLoading(true);
        try {
            await fetch(`${API_URL}/news`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newNews)
            });
            setOpenNewsDialog(false);
            fetchNews();
            setNewNews({ title: '', titleKa: '', content: '', contentKa: '', flashUpdate: false, imageUrl: '' });
        } catch (err) {
            alert('Failed to create news');
        }
        setLoading(false);
    };

    const handleCreateEvent = async () => {
        setLoading(true);
        try {
            await fetch(`${API_URL}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEvent)
            });
            setOpenEventDialog(false);
            fetchEvents();
            setNewEvent({ title: '', description: '', eventDate: '', location: 'Sode Matha' });
        } catch (err) {
            alert('Failed to create event');
        }
        setLoading(false);
    };

    const handleSaveGalleryItem = async () => {
        setLoading(true);
        try {
            const method = newGalleryItem.id ? 'PUT' : 'POST';
            const url = newGalleryItem.id ? `${API_URL}/gallery/${newGalleryItem.id}` : `${API_URL}/gallery`;
            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGalleryItem)
            });
            setOpenGalleryDialog(false);
            fetchGallery();
            setNewGalleryItem({ title: '', imageUrl: '', category: 'Deity' });
        } catch (err) {
            alert('Failed to save gallery item');
        }
        setLoading(false);
    };

    const handleDeleteGalleryItem = async (id: number) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE' });
            fetchGallery();
        } catch (e) { alert("Failed to delete gallery item"); }
    };

    const handleSaveInstitution = async () => {
        setLoading(true);
        try {
            const method = newInstitution.id ? 'PUT' : 'POST';
            const url = newInstitution.id ? `${API_URL}/institutions/${newInstitution.id}` : `${API_URL}/institutions`;
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newInstitution)
            });
            if (res.ok) {
                setOpenInstitutionDialog(false);
                fetchInstitutions();
                setNewInstitution({ id: 0, name: '', location: '', website: '', contact: '' });
            } else { alert("Failed to save institution"); }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleDeleteInstitution = async (id: number) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await fetch(`${API_URL}/institutions/${id}`, { method: 'DELETE' });
            fetchInstitutions();
        } catch (e) { alert("Failed to delete institution"); }
    };

    const handleSaveLiteraryWork = async () => {
        setLoading(true);
        try {
            const method = newLiteraryWork.id ? 'PUT' : 'POST';
            const url = newLiteraryWork.id ? `${API_URL}/literary-works/${newLiteraryWork.id}` : `${API_URL}/literary-works`;
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newLiteraryWork)
            });
            if (res.ok) {
                setOpenLiteraryDialog(false);
                fetchLiteraryWorks();
                setNewLiteraryWork({ id: 0, title: '', titleKa: '', category: '', description: '' });
            } else { alert("Failed to save literary work"); }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleDeleteLiteraryWork = async (id: number) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await fetch(`${API_URL}/literary-works/${id}`, { method: 'DELETE' });
            fetchLiteraryWorks();
        } catch (e) { alert("Failed to delete literary work"); }
    };

    const handleSaveMiracle = async () => {
        setLoading(true);
        try {
            const method = newMiracle.id ? 'PUT' : 'POST';
            const url = newMiracle.id ? `${API_URL}/miracles/${newMiracle.id}` : `${API_URL}/miracles`;
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMiracle)
            });
            if (res.ok) {
                setOpenMiracleDialog(false);
                fetchMiracles();
                setNewMiracle({ id: 0, title: '', titleKa: '', descriptionEn: '', descriptionKa: '' });
            } else { alert("Failed to save miracle"); }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleDeleteMiracle = async (id: number) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await fetch(`${API_URL}/miracles/${id}`, { method: 'DELETE' });
            fetchMiracles();
        } catch (e) { alert("Failed to delete miracle"); }
    };

    const handleSaveQuizQuestion = async () => {
        setLoading(true);
        try {
            const method = newQuestion.id ? 'PUT' : 'POST';
            const url = newQuestion.id ? `${API_URL}/quiz/questions/${newQuestion.id}` : `${API_URL}/quiz/questions`;
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newQuestion)
            });
            if (res.ok) {
                setOpenQuizDialog(false);
                fetchQuizQuestions();
                setNewQuestion({ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', language: 'EN' });
            } else { alert("Failed to save question"); }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleDeleteQuizQuestion = async (id: number) => {
        if (!window.confirm("Delete this question?")) return;
        try {
            await fetch(`${API_URL}/quiz/questions/${id}`, { method: 'DELETE' });
            fetchQuizQuestions();
        } catch (e) { alert("Failed to delete question"); }
    };
    const handleSaveRenovationUpdate = async () => {
        setLoading(true);
        try {
            const method = newRenovation.id ? 'PUT' : 'POST';
            const url = newRenovation.id ? `${API_URL}/renovation/${newRenovation.id}` : `${API_URL}/renovation`;
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRenovation)
            });
            if (res.ok) {
                setOpenRenovationDialog(false);
                fetchRenovationUpdates();
                setNewRenovation({ id: 0, title: '', description: '', targetAmount: 0, collectedAmount: 0, contributorsCount: 0, status: 'ONGOING' });
            } else { alert("Failed to save renovation update"); }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleDeleteRenovationUpdate = async (id: number) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await fetch(`${API_URL}/renovation/${id}`, { method: 'DELETE' });
            fetchRenovationUpdates();
        } catch (e) { alert("Failed to delete renovation update"); }
    };

    const handleSaveVideo = async () => {
        setLoading(true);
        try {
            const method = newVideo.id ? 'PUT' : 'POST';
            const url = newVideo.id ? `${API_URL}/videos/${newVideo.id}` : `${API_URL}/videos`;
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newVideo)
            });
            if (res.ok) {
                setOpenVideoDialog(false);
                fetchVideos();
                setNewVideo({ id: 0, title: '', titleKa: '', category: '', videoUrl: '', thumbnailUrl: '' });
            } else { alert("Failed to save video"); }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleDeleteVideo = async (id: number) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await fetch(`${API_URL}/videos/${id}`, { method: 'DELETE' });
            fetchVideos();
        } catch (e) { alert("Failed to delete video"); }
    };
    const handleSavePlace = async () => {
        setLoading(true);
        try {
            const method = newPlace.id ? 'PUT' : 'POST';
            const url = newPlace.id ? `${API_URL}/places/${newPlace.id}` : `${API_URL}/places`;
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPlace)
            });
            if (res.ok) {
                setOpenPlaceDialog(false);
                fetchPlacesToVisit();
                setNewPlace({ name: '', nameKa: '', descriptionEn: '', descriptionKa: '', imageUrl: '', mapUrl: '' });
            } else { alert("Failed to save place"); }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleDeletePlace = async (id: number) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await fetch(`${API_URL}/places/${id}`, { method: 'DELETE' });
            fetchPlacesToVisit();
        } catch (e) { alert("Failed to delete place"); }
    };

    const handleUpdateConfig = async (config: AppConfig) => {
        try {
            await fetch(`${API_URL}/config/${config.configKey}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            fetchAppConfigs();
        } catch (e) { console.error(e); }
    };

    const handleSaveHistory = async () => {
        try {
            await fetch(`${API_URL}/history`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(historyData)
            });
            alert('History updated');
        } catch (e) { console.error(e); }
    };

    const handleSaveParampara = async () => {
        try {
            const method = newParampara.id ? 'PUT' : 'POST';
            const url = newParampara.id ? `${API_URL}/parampara/${newParampara.id}` : `${API_URL}/parampara`;
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newParampara)
            });
            setOpenParamparaDialog(false);
            fetchParampara();
        } catch (e) { console.error(e); }
    };

    const handleDeleteParampara = async (id: number) => {
        if (!window.confirm('Delete this entry?')) return;
        try {
            await fetch(`${API_URL}/parampara/${id}`, { method: 'DELETE' });
            fetchParampara();
        } catch (e) { console.error(e); }
    };

    const handleSaveBhootarajaru = async () => {
        try {
            const method = newBhootarajaru.id ? 'PUT' : 'POST';
            const url = newBhootarajaru.id ? `${API_URL}/bhootarajaru/${newBhootarajaru.id}` : `${API_URL}/bhootarajaru`;
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBhootarajaru)
            });
            if (res.ok && selectedFile) {
                const data = await res.json();
                const formData = new FormData();
                formData.append('image', selectedFile);
                await fetch(`${API_URL}/bhootarajaru/${data.id}/image`, {
                    method: 'POST',
                    body: formData
                });
            }
            setOpenBhootarajaruDialog(false);
            fetchBhootarajaru();
        } catch (e) { console.error(e); }
    };

    const handleDeleteBhootarajaru = async (id: number) => {
        if (!window.confirm('Delete this entry?')) return;
        try {
            await fetch(`${API_URL}/bhootarajaru/${id}`, { method: 'DELETE' });
            fetchBhootarajaru();
        } catch (e) { console.error(e); }
    };


    const handleDeleteNews = async (id: number) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await fetch(`${API_URL}/news/${id}`, { method: 'DELETE' });
            fetchNews();
        } catch (e) {
            alert("Failed to delete");
        }
    };

    const handleApproveVolunteer = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/users/${id}/approve-volunteer`, { method: 'PUT' });
            if (res.ok) fetchUsers();
        } catch (e) { console.error(e); }
    };
    const renderDashboard = () => {
        const pendingVolunteers = users.filter(u => u.volunteerStatus === 'PENDING');
        const activeUsers = users.length;

        return (
            <Box>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1a237e' }}>
                    Dashboard Overview
                </Typography>

                <Grid container spacing={3}>
                    {/* Summary Stats */}
                    <Grid item xs={12} md={3}>
                        <Card sx={{ height: '100%', borderTop: '4px solid #1a237e', elevation: 3, textAlign: 'center' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <PeopleIcon sx={{ color: '#1a237e', mr: 1 }} />
                                    <Typography color="textSecondary" variant="subtitle2">Total Devotees</Typography>
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{activeUsers}</Typography>
                                <Typography variant="caption" color="success.main">Active Members</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card sx={{ height: '100%', borderTop: '4px solid #ff9800', elevation: 3, textAlign: 'center' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <AccountBalanceWalletIcon sx={{ color: '#ff9800', mr: 1 }} />
                                    <Typography color="textSecondary" variant="subtitle2">Seva Revenue</Typography>
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    ₹{analyticsData?.seva_weekly.reduce((acc, c) => acc + c.amount, 0).toLocaleString() || '0'}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">Expected this week</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card sx={{ height: '100%', borderTop: '4px solid #4caf50', elevation: 3, textAlign: 'center' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <VolunteerActivismIcon sx={{ color: '#4caf50', mr: 1 }} />
                                    <Typography color="textSecondary" variant="subtitle2">Sevas Booked</Typography>
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {analyticsData?.seva_weekly.reduce((acc, c) => acc + c.bookings, 0) || '0'}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">Last 7 days</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card sx={{ height: '100%', borderTop: '4px solid #f44336', elevation: 3, textAlign: 'center' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <FeedbackIcon sx={{ color: '#f44336', mr: 1 }} />
                                    <Typography color="textSecondary" variant="subtitle2">Pending Approvals</Typography>
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{pendingVolunteers.length}</Typography>
                                <Typography variant="caption" color="error">Volunteers waiting</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Recent Activity / Notifications */}
                    <Grid item xs={12}>
                        <Card sx={{ mt: 3, elevation: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="#1a237e" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ArticleIcon sx={{ mr: 1 }} /> Recent Activity
                                </Typography>
                                <List>
                                    {notifications.length === 0 ? (
                                        <Typography variant="body2" color="textSecondary">No recent activity</Typography>
                                    ) : (
                                        notifications.slice(0, 5).map((n, i) => (
                                            <ListItem key={i} divider={i < 4} sx={{ px: 0 }}>
                                                <ListItemText
                                                    primary={n.message}
                                                    secondary={new Date(n.timestamp).toLocaleString()}
                                                    primaryTypographyProps={{ variant: 'body2' }}
                                                />
                                            </ListItem>
                                        ))
                                    )}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Volunteer Approval Queue */}
                    {pendingVolunteers.length > 0 && (
                        <Grid item xs={12}>
                            <Card sx={{ border: '1px solid #ffebee', bgcolor: '#fff9f9' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom color="error" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <FeedbackIcon sx={{ mr: 1 }} /> Volunteer Enrollment Requests
                                    </Typography>
                                    <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Mobile</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {pendingVolunteers.map((v) => (
                                                    <TableRow key={v.id}>
                                                        <TableCell>{v.name}</TableCell>
                                                        <TableCell>{v.mobileNumber}</TableCell>
                                                        <TableCell>{v.address || 'N/A'}</TableCell>
                                                        <TableCell align="right">
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                color="success"
                                                                startIcon={<CheckCircleIcon />}
                                                                onClick={() => v.id && handleApproveVolunteer(v.id)}
                                                            >
                                                                Approve
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {/* Analytics Preview */}
                    <Grid item xs={12} md={8}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="#1a237e">Weekly Performance</Typography>
                                <div style={{ width: '100%', height: 280 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={analyticsData?.seva_weekly || []}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip cursor={{ fill: '#f5f5f5' }} />
                                            <Bar dataKey="bookings" fill="#1a237e" radius={[4, 4, 0, 0]} name="Bookings" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="#1a237e">Quick Actions</Typography>
                                <Box display="flex" flexDirection="column" gap={1.5} mt={2}>
                                    <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setOpenUserDialog(true)} sx={{ color: '#1a237e', borderColor: '#1a237e' }}>
                                        Register New Devotee
                                    </Button>
                                    <Button variant="outlined" startIcon={<ArticleIcon />} onClick={() => setOpenNewsDialog(true)} sx={{ color: '#1a237e', borderColor: '#1a237e' }}>
                                        Post Announcement
                                    </Button>
                                    <Button variant="outlined" startIcon={<EventIcon />} onClick={() => setOpenEventDialog(true)} sx={{ color: '#1a237e', borderColor: '#1a237e' }}>
                                        Schedule Event
                                    </Button>
                                    <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => window.open(`${API_URL}/users/export`, '_blank')} sx={{ color: '#1a237e', borderColor: '#1a237e' }}>
                                        Download Devotee List
                                    </Button>
                                </Box>

                                <Box mt={4} textAlign="center">
                                    <img
                                        src="/matha-logo.png"
                                        alt="Matha Logo"
                                        style={{ opacity: 0.1, width: '120px', position: 'absolute', bottom: 20, right: 20 }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    const renderDevotees = () => (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={3} alignItems="center">
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Registered Devotees</Typography>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        sx={{ mr: 1, color: '#1a237e', borderColor: '#1a237e' }}
                        onClick={() => window.open(`${API_URL}/users/export`, '_blank')}
                    >
                        Export CSV
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenUserDialog(true)}
                        sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#e68a00' } }}
                    >
                        Add Devotee
                    </Button>
                </Box>
            </Box>
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#1a237e' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Mobile</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Role</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Volunteer Status</TableCell>
                            <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                                <TableCell>{user.mobileNumber}</TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: 'inline-block',
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1,
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            bgcolor: user.role === 'ADMIN' ? '#e3f2fd' : '#f5f5f5',
                                            color: user.role === 'ADMIN' ? '#1a237e' : '#666'
                                        }}
                                    >
                                        {user.role}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: 'inline-block',
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1,
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            bgcolor:
                                                user.volunteerStatus === 'APPROVED' ? '#e8f5e9' :
                                                    user.volunteerStatus === 'PENDING' ? '#fff3e0' :
                                                        '#f5f5f5',
                                            color:
                                                user.volunteerStatus === 'APPROVED' ? '#2e7d32' :
                                                    user.volunteerStatus === 'PENDING' ? '#ef6c00' :
                                                        '#999'
                                        }}
                                    >
                                        {user.volunteerStatus || 'NONE'}
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => { setNewUser(user); setOpenUserDialog(true); }} sx={{ color: '#1a237e' }}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => user.id && handleDeleteUser(user.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box >
    );

    const renderNews = () => (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={3} alignItems="center">
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e' }}>News & Announcements</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenNewsDialog(true)} sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#e68a00' } }}>
                    Post News
                </Button>
            </Box>
            <Grid container spacing={2}>
                {news && news.map((item) => (
                    <Grid item xs={12} md={6} key={item.id}>
                        <Card sx={{
                            borderLeft: item.flashUpdate ? '5px solid #d32f2f' : '5px solid #1a237e',
                            boxShadow: 2
                        }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="h6">{item.title}</Typography>
                                    <IconButton onClick={() => handleDeleteNews(item.id!)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                                <Typography variant="body2" color="textSecondary">{item.publishedAt}</Typography>
                                {item.flashUpdate && <Typography variant="caption" color="error" fontWeight="bold">FLASH UPDATE</Typography>}
                                <Typography mt={1}>{item.content}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

    const renderEvents = () => (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={3} alignItems="center">
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Upcoming Events</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenEventDialog(true)} sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#e68a00' } }}>
                    Add Event
                </Button>
            </Box>
            <Grid container spacing={2}>
                {events && events.map((e) => (
                    <Grid item xs={12} md={4} key={e.id}>
                        <Card sx={{ boxShadow: 2 }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <EventIcon sx={{ color: '#1a237e', mr: 1 }} />
                                    <Typography variant="h6">{e.title}</Typography>
                                </Box>
                                <Typography variant="subtitle2" color="textSecondary">
                                    {e.eventDate} @ {e.location}
                                </Typography>
                                <Typography variant="body2" mt={1}>{e.description}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

    const renderSevas = () => (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={3} alignItems="center">
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Seva Management</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
                    setNewSeva({ id: 0, name: '', description: '', amount: 0, type: 'POOJA', active: true, location: 'SODE' });
                    setOpenSevaDialog(true);
                }} sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#e68a00' } }}>
                    Add Seva
                </Button>
            </Box>
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#1a237e' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Amount</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Type</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Location</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sevas.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell sx={{ fontWeight: 'bold' }}>{s.name}</TableCell>
                                <TableCell>₹{s.amount}</TableCell>
                                <TableCell>{s.type}</TableCell>
                                <TableCell>{s.location}</TableCell>
                                <TableCell>{s.active ? 'Active' : 'Hidden'}</TableCell>
                                <TableCell>
                                    <IconButton size="small" onClick={() => { setNewSeva(s); setOpenSevaDialog(true); }}>
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const renderGallery = () => (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={3} alignItems="center">
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Gallery</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenGalleryDialog(true)} sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#e68a00' } }}>
                    Add Image
                </Button>
            </Box>
            <Grid container spacing={2}>
                {galleryItems && galleryItems.map((item) => (
                    <Grid item xs={12} md={3} key={item.id}>
                        <Card>
                            <Box sx={{ position: 'relative' }}>
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                />
                                <Box sx={{ position: 'absolute', top: 5, right: 5, display: 'flex', gap: 0.5 }}>
                                    <IconButton
                                        size="small"
                                        sx={{ bgcolor: 'rgba(255,255,255,0.7)' }}
                                        onClick={() => { setNewGalleryItem(item); setOpenGalleryDialog(true); }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        sx={{ bgcolor: 'rgba(255,255,255,0.7)' }}
                                        onClick={() => item.id && handleDeleteGalleryItem(item.id)}
                                    >
                                        <DeleteIcon fontSize="small" color="error" />
                                    </IconButton>
                                </Box>
                            </Box>
                            <CardContent>
                                <Typography variant="subtitle2">{item.title}</Typography>
                                <Typography variant="caption" color="textSecondary">{item.category}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

    const renderRoomBookings = () => (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 3 }}>Room Booking Management</Typography>
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#1a237e' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Devotee</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Mobile</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Check-In/Out</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Details</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Aadhaar (Last 4)</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roomBookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>{booking.id}</TableCell>
                                <TableCell>{booking.devoteeName}</TableCell>
                                <TableCell>{booking.mobileNumber}</TableCell>
                                <TableCell>{booking.checkInDate} to {booking.checkOutDate}</TableCell>
                                <TableCell>
                                    {booking.numberOfRooms} {booking.roomType} Room(s)<br />
                                    {booking.adults} Adults, {booking.children} Children
                                </TableCell>
                                <TableCell>{booking.aadhaar ? booking.aadhaar.slice(-4) : 'N/A'}</TableCell>
                                <TableCell>
                                    <Box px={1} py={0.5} borderRadius={1}
                                        bgcolor={booking.status === 'APPROVED' ? '#e8f5e9' : booking.status === 'REJECTED' ? '#ffebee' : '#fff3e0'}
                                        color={booking.status === 'APPROVED' ? 'green' : booking.status === 'REJECTED' ? 'red' : 'orange'}
                                        display="inline-block">
                                        {booking.status}
                                    </Box>
                                    {booking.rejectionReason && (
                                        <Typography variant="caption" display="block" color="error" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                                            Reason: {booking.rejectionReason}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {booking.status === 'PENDING' && (
                                        <>
                                            <Button size="small" variant="contained" color="success" onClick={async () => {
                                                try {
                                                    const res = await fetch(`${API_URL}/rooms/${booking.id}/status?status=APPROVED`, { method: 'PUT' });
                                                    if (res.ok) fetchRoomBookings();
                                                    else alert('Failed to update status');
                                                } catch (e) { alert('Error updating status'); }
                                            }} sx={{ mr: 1 }}>
                                                Confirm
                                            </Button>
                                            <Button size="small" variant="contained" color="error" onClick={async () => {
                                                const reason = window.prompt("Enter reason for rejection (optional):") || "";
                                                if (reason === null) return;
                                                try {
                                                    const res = await fetch(`${API_URL}/rooms/${booking.id}/status?status=REJECTED&reason=${encodeURIComponent(reason)}`, { method: 'PUT' });
                                                    if (res.ok) fetchRoomBookings();
                                                    else alert('Failed to update status');
                                                } catch (e) { alert('Error updating status'); }
                                            }}>
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const renderHistory = () => (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1a237e' }}>Matha History</Typography>
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom>History Content (English)</Typography>
                            <TextField
                                fullWidth multiline rows={6}
                                value={historyData.contentEn || ''}
                                onChange={(e) => setHistoryData({ ...historyData, contentEn: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom>History Content (Kannada)</Typography>
                            <TextField
                                fullWidth multiline rows={6}
                                value={historyData.contentKa || ''}
                                onChange={(e) => setHistoryData({ ...historyData, contentKa: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" onClick={handleSaveHistory} sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#e68a00' } }}>
                                Save History Content
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Box display="flex" justifyContent="space-between" mb={3} alignItems="center">
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Guru Parampara</Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#e68a00' } }} onClick={() => {
                    setNewParampara({
                        id: 0, name: '', period: '', guru: '', shishya: '',
                        vrindavanaLocation: '', vrindavanaUrl: '', photoUrl: '',
                        descriptionEn: '', descriptionKa: ''
                    }); setOpenParamparaDialog(true);
                }}>Add Guru</Button>
            </Box>
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#1a237e' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Period</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Guru</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Shishya</TableCell>
                            <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paramparaList.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.period}</TableCell>
                                <TableCell>{item.guru}</TableCell>
                                <TableCell>{item.shishya}</TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => { setNewParampara(item); setOpenParamparaDialog(true); }}><EditIcon /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDeleteParampara(item.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box display="flex" justifyContent="space-between" mb={3} alignItems="center" sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Sri Bhutaraja</Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#e68a00' } }} onClick={() => {
                    setNewBhootarajaru({ id: 0, name: '', descriptionEn: '', descriptionKa: '' });
                    setSelectedFile(null);
                    setOpenBhootarajaruDialog(true);
                }}>Add Entry</Button>
            </Box>
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#1a237e' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Image</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Description (EN)</TableCell>
                            <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bhootarajaruList.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                    <Avatar src={`${API_URL}/bhootarajaru/${item.id}/image`} variant="rounded" />
                                </TableCell>
                                <TableCell>
                                    <div style={{ maxHeight: 100, overflow: 'hidden' }}>{item.descriptionEn}</div>
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => {
                                        setNewBhootarajaru(item);
                                        setSelectedFile(null);
                                        setOpenBhootarajaruDialog(true);
                                    }}><EditIcon /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDeleteBhootarajaru(item.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const renderBranches = () => (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5">Branch Network</Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#ff9800' }} onClick={() => { setNewBranch({ id: 0, name: '', location: '', contact: '' }); setOpenBranchDialog(true); }}>Add Branch</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#eee' }}>
                        <TableRow>
                            <TableCell>Branch Name</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {branches.map((branch) => (
                            <TableRow key={branch.id}>
                                <TableCell>
                                    {branch.name}<br />
                                    <Typography variant="caption" color="textSecondary">{branch.nameKa}</Typography>
                                </TableCell>
                                <TableCell>
                                    {branch.location}<br />
                                    <Typography variant="caption" color="textSecondary">{branch.locationKa}</Typography>
                                </TableCell>
                                <TableCell>{branch.contact}</TableCell>
                                <TableCell>
                                    <IconButton size="small" onClick={() => { setNewBranch(branch); setOpenBranchDialog(true); }}><EditIcon /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => branch.id && handleDeleteBranch(branch.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const renderDonations = () => (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1a237e' }}>Donation Logs (E-Kanike)</Typography>
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#1a237e' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Donor Name</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Purpose</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Amount (₹)</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Transaction ID</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Timestamp</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {donations.map((d) => (
                            <TableRow key={d.id}>
                                <TableCell>{d.id}</TableCell>
                                <TableCell>{d.donorName}<br /><Typography variant="caption">{d.donorEmail}</Typography></TableCell>
                                <TableCell>{d.purpose}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>{d.amount}</TableCell>
                                <TableCell>{d.transactionId}</TableCell>
                                <TableCell>{new Date(d.timestamp).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Box px={1} py={0.5} borderRadius={1} bgcolor="#e8f5e9" color="green" display="inline-block">
                                        {d.status}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const renderVisits = () => (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1a237e' }}>Daily Devotee Visits</Typography>
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#1a237e' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Devotee Name</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Mobile</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Place</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>People Count</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Visit Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visits.map((v) => (
                            <TableRow key={v.id}>
                                <TableCell>{v.id}</TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>{v.devoteeName}</TableCell>
                                <TableCell>{v.mobileNumber}</TableCell>
                                <TableCell>{v.place}</TableCell>
                                <TableCell>{v.numberOfPeople}</TableCell>
                                <TableCell>{v.visitDate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const renderAnalytics = () => (
        <Box>
            <Typography variant="h5" gutterBottom>Analytics Dashboard</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Weekly Seva Bookings</Typography>
                            <div style={{ width: '100%', height: 300 }}>
                                {analyticsData && (
                                    <ResponsiveContainer>
                                        <BarChart data={analyticsData.seva_weekly}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="bookings" fill="#8884d8" name="Bookings" />
                                            <Bar dataKey="amount" fill="#82ca9d" name="Amount (₹)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Monthly Donations</Typography>
                            <div style={{ width: '100%', height: 300 }}>
                                {analyticsData && (
                                    <ResponsiveContainer>
                                        <BarChart data={analyticsData.donations_monthly}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="amount" fill="#ffc658" name="Donations (₹)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );

    const renderSevaBookings = () => (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={3} alignItems="center">
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Seva Bookings</Typography>
            </Box>
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#1a237e' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Devotee</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Seva</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Sankalpa / Gotra</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Booking Date</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Transaction ID</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sevaBookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>{booking.id}</TableCell>
                                <TableCell>
                                    {booking.user?.name}<br />
                                    <Typography variant="caption" color="textSecondary">{booking.user?.mobileNumber}</Typography>
                                </TableCell>
                                <TableCell>{booking.seva?.name}</TableCell>
                                <TableCell>{booking.sankalpaDetails}</TableCell>
                                <TableCell>{booking.bookingDate}</TableCell>
                                <TableCell>{booking.transactionId}</TableCell>
                                <TableCell>
                                    <Box px={1} py={0.5} borderRadius={1}
                                        bgcolor={booking.status === 'CONFIRMED' ? '#e8f5e9' : booking.status === 'REJECTED' ? '#ffebee' : '#fff3e0'}
                                        color={booking.status === 'CONFIRMED' ? 'green' : booking.status === 'REJECTED' ? 'red' : 'orange'}
                                        display="inline-block">
                                        {booking.status}
                                    </Box>
                                    {booking.rejectionReason && (
                                        <Typography variant="caption" display="block" color="error" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                                            Reason: {booking.rejectionReason}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    {booking.status === 'PENDING' && (
                                        <>
                                            <Button size="small" variant="contained" color="success" onClick={async () => {
                                                try {
                                                    const res = await fetch(`${API_URL}/seva-bookings/${booking.id}/status?status=CONFIRMED`, { method: 'PUT' });
                                                    if (res.ok) fetchSevaBookings();
                                                    else alert('Failed to update status');
                                                } catch (e) { alert('Error updating status'); }
                                            }} sx={{ mr: 1 }}>
                                                Confirm
                                            </Button>
                                            <Button size="small" variant="contained" color="error" onClick={async () => {
                                                const reason = window.prompt("Enter reason for rejection (optional):") || "";
                                                if (reason === null) return;
                                                try {
                                                    const res = await fetch(`${API_URL}/seva-bookings/${booking.id}/status?status=REJECTED&reason=${encodeURIComponent(reason)}`, { method: 'PUT' });
                                                    if (res.ok) fetchSevaBookings();
                                                    else alert('Failed to update status');
                                                } catch (e) { alert('Error updating status'); }
                                            }}>
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const renderInstitutions = () => (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5">Educational Institutions</Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#ff9800' }} onClick={() => { setNewInstitution({ id: 0, name: '', location: '', website: '', contact: '' }); setOpenInstitutionDialog(true); }}>Add Institution</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#eee' }}>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Website</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {institutions.map((inst) => (
                            <TableRow key={inst.id}>
                                <TableCell>{inst.name}</TableCell>
                                <TableCell>{inst.location}</TableCell>
                                <TableCell>{inst.website}</TableCell>
                                <TableCell>
                                    <IconButton size="small" onClick={() => { setNewInstitution(inst); setOpenInstitutionDialog(true); }}><EditIcon /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDeleteInstitution(inst.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const renderLiteraryWorks = () => (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5">Literary Works (Granthas)</Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#ff9800' }} onClick={() => { setNewLiteraryWork({ id: 0, title: '', titleKa: '', category: '', description: '' }); setOpenLiteraryDialog(true); }}>Add Work</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#eee' }}>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {literaryWorks.map((work) => (
                            <TableRow key={work.id}>
                                <TableCell>{work.title} / {work.titleKa}</TableCell>
                                <TableCell>{work.category}</TableCell>
                                <TableCell>{work.description}</TableCell>
                                <TableCell>
                                    <IconButton size="small" onClick={() => { setNewLiteraryWork(work); setOpenLiteraryDialog(true); }}><EditIcon /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDeleteLiteraryWork(work.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const renderMiracles = () => (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5">Miracles</Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#ff9800' }} onClick={() => { setNewMiracle({ id: 0, title: '', titleKa: '', descriptionEn: '', descriptionKa: '' }); setOpenMiracleDialog(true); }}>Add Miracle</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#eee' }}>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {miracles.map((m) => (
                            <TableRow key={m.id}>
                                <TableCell>{m.title}</TableCell>
                                <TableCell>{m.descriptionEn.substring(0, 50)}...</TableCell>
                                <TableCell>
                                    <IconButton size="small" onClick={() => { setNewMiracle(m); setOpenMiracleDialog(true); }}><EditIcon /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDeleteMiracle(m.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const renderRenovation = () => (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5">Renovation Project Updates</Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#ff9800' }} onClick={() => { setNewRenovation({ id: 0, title: '', description: '', targetAmount: 0, collectedAmount: 0, contributorsCount: 0, status: 'ONGOING' }); setOpenRenovationDialog(true); }}>Add Update</Button>
            </Box>
            <Card sx={{ mb: 3, bgcolor: '#e3f2fd' }}>
                <CardContent>
                    <Typography variant="h6">Project Overview</Typography>
                    <Typography variant="body2">Total Target: ₹30 Crores</Typography>
                    <Typography variant="body2">Contributors: {renovationUpdates.reduce((acc, c) => acc + c.contributorsCount, 0)}</Typography>
                </CardContent>
            </Card>
            <Grid container spacing={2}>
                {renovationUpdates.map((update) => (
                    <Grid item xs={12} key={update.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight="bold">{update.title}</Typography>
                                <Typography variant="body2">{update.description}</Typography>
                                <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography variant="caption" display="block">Collected: ₹{update.collectedAmount}</Typography>
                                        <Typography variant="caption" display="block">Status: {update.status}</Typography>
                                    </Box>
                                    <Box>
                                        <IconButton size="small" onClick={() => { setNewRenovation(update); setOpenRenovationDialog(true); }}><EditIcon /></IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDeleteRenovationUpdate(update.id)}><DeleteIcon /></IconButton>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

    const renderVideos = () => (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5">Video Gallery</Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#ff9800' }} onClick={() => { setNewVideo({ id: 0, title: '', titleKa: '', category: '', videoUrl: '', thumbnailUrl: '' }); setOpenVideoDialog(true); }}>Add Video</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#eee' }}>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Video URL</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {videos.map((video) => (
                            <TableRow key={video.id}>
                                <TableCell>{video.title}</TableCell>
                                <TableCell>{video.category}</TableCell>
                                <TableCell>{video.videoUrl}</TableCell>
                                <TableCell>
                                    <IconButton size="small" onClick={() => { setNewVideo(video); setOpenVideoDialog(true); }}><EditIcon /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDeleteVideo(video.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const renderQuiz = () => (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5">Youth Quiz Questions</Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#ff9800' }} onClick={() => {
                    setNewQuestion({ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', language: 'EN' });
                    setOpenQuizDialog(true);
                }}>Add Question</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#eee' }}>
                        <TableRow>
                            <TableCell>Question</TableCell>
                            <TableCell>Options</TableCell>
                            <TableCell>Correct</TableCell>
                            <TableCell>Lang</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {quizQuestions.map((q) => (
                            <TableRow key={q.id}>
                                <TableCell>{q.question}</TableCell>
                                <TableCell>
                                    <Typography variant="caption" display="block">A: {q.optionA}</Typography>
                                    <Typography variant="caption" display="block">B: {q.optionB}</Typography>
                                    <Typography variant="caption" display="block">C: {q.optionC}</Typography>
                                    <Typography variant="caption" display="block">D: {q.optionD}</Typography>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'green' }}>{q.correctAnswer}</TableCell>
                                <TableCell>{q.language}</TableCell>
                                <TableCell>
                                    <IconButton size="small" onClick={() => { setNewQuestion(q); setOpenQuizDialog(true); }}><EditIcon /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => q.id && handleDeleteQuizQuestion(q.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
    const renderPlaces = () => (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5">Places to Visit in Sode</Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#ff9800' }} onClick={() => {
                    setNewPlace({ name: '', nameKa: '', descriptionEn: '', descriptionKa: '', imageUrl: '', mapUrl: '', distance: '' });
                    setOpenPlaceDialog(true);
                }}>Add Place</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#eee' }}>
                        <TableRow>
                            <TableCell>Place Name</TableCell>
                            <TableCell>Distance</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {placesToVisit.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Avatar variant="rounded" src={p.imageUrl} sx={{ width: 40, height: 40 }} />
                                        <Box>
                                            <Typography variant="body1" fontWeight="bold">{p.name}</Typography>
                                            <Typography variant="caption" color="textSecondary">{p.nameKa}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>{p.distance}</TableCell>
                                <TableCell>
                                    <Typography variant="body2">{(p.descriptionEn || '').substring(0, 100)}...</Typography>
                                </TableCell>
                                <TableCell>
                                    <IconButton size="small" onClick={() => { setNewPlace(p); setOpenPlaceDialog(true); }}><EditIcon /></IconButton>
                                    {p.mapUrl && (
                                        <IconButton size="small" color="primary" onClick={() => window.open(p.mapUrl, '_blank')}><MapIcon /></IconButton>
                                    )}
                                    <IconButton size="small" color="error" onClick={() => p.id && handleDeletePlace(p.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const renderSettings = () => (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1a237e' }}>Global Application Settings</Typography>
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: '#1a237e' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Setting Key</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Value / Description</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Enabled</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appConfigs.map((cfg) => (
                            <TableRow key={cfg.configKey}>
                                <TableCell sx={{ fontWeight: '500' }}>{cfg.configKey}</TableCell>
                                <TableCell>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={cfg.configValue}
                                        onChange={(e) => {
                                            const updated = appConfigs.map(c => c.configKey === cfg.configKey ? { ...c, configValue: e.target.value } : c);
                                            setAppConfigs(updated);
                                        }}
                                        onBlur={async () => {
                                            try {
                                                await fetch(`${API_URL}/config/${cfg.configKey}`, {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify(cfg)
                                                });
                                            } catch (e) { console.error(e); }
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Switch
                                        checked={cfg.enabled}
                                        onChange={() => handleToggleConfig(cfg)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    console.log('Rendering App, currentTab:', currentTab);

    const isSectionEnabled = (tabName: string) => {
        // Default true for core admin tabs
        if (['Dashboard', 'Devotees', 'News & Updates', 'Events', 'Settings', 'Analytics', 'Branches', 'Sri Bhuta Raja', 'Quiz'].includes(tabName)) return true;

        // Map tabs to config keys
        const map: { [key: string]: string } = {
            'Sevas': 'section_sevas',
            'Gallery': 'section_gallery',
            'History': 'section_history',
            'Room Bookings': 'section_rooms',
            'Institutions': 'section_institutions',
            'Literary Works': 'section_literary_works',
            'Miracles': 'section_miracles',
            'Renovation': 'section_renovation',
            'Videos': 'section_videos',
            'Settings': 'section_settings' // Assuming a config for settings itself if needed
        };
        const key = map[tabName];
        if (!key) return true; // If no config key, default to true
        const config = appConfigs.find(c => c.configKey === key);
        return config ? config.enabled : true; // If config found, use its enabled status, else default to true
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#1a237e' }}>
                <Toolbar>
                    <Avatar
                        src="/matha-logo.png"
                        sx={{ mr: 2, bgcolor: '#fff', width: 40, height: 40 }}
                    >
                        <Typography sx={{ color: '#1a237e', fontWeight: 'bold' }}>SM</Typography>
                    </Avatar>
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', letterSpacing: 0.5, color: '#ffca28' }}>
                        Sode Sri Vadiraja Matha - Admin Portal
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box display="flex" flexDirection="column" alignItems="center" mr={2}>
                        <Box display="flex" gap={1}>
                            <img src="/swamijis.png" alt="Swamijis" style={{ height: '50px', border: '2px solid #fff', borderRadius: '8px' }} />
                        </Box>
                        <Box textAlign="right" sx={{ mt: 0.5 }}>
                            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 'bold', fontSize: '0.6rem', display: 'block', lineHeight: 1.1 }}>
                                Sri Sri Vishwothama Teertha Swamiji
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 'bold', fontSize: '0.6rem', display: 'block', lineHeight: 1.1 }}>
                                Sri Sri Vishwavallabha Teertha Swamiji
                            </Typography>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {[
                            { text: 'Dashboard', icon: <DashboardIcon /> },
                            { text: 'Devotees', icon: <PeopleIcon /> },
                            { text: 'News & Updates', icon: <ArticleIcon /> },
                            { text: 'Events', icon: <EventIcon /> },
                            { text: 'Sevas', icon: <VolunteerActivismIcon /> },
                            { text: 'Gallery', icon: <PhotoLibraryIcon /> },
                            { text: 'History', icon: <MenuBookIcon /> },
                            { text: 'Branches', icon: <HotelIcon /> },
                            { text: 'Seva Bookings', icon: <VolunteerActivismIcon /> },
                            { text: 'Room Bookings', icon: <HotelIcon /> },
                            { text: 'Analytics', icon: <AssessmentIcon /> },
                            { text: 'Institutions', icon: <SchoolIcon /> },
                            { text: 'Literary Works', icon: <MenuBookIcon /> },
                            { text: 'Miracles', icon: <VolunteerActivismIcon /> },
                            { text: 'Renovation', icon: <DashboardIcon /> },
                            { text: 'Videos', icon: <ArticleIcon /> },
                            { text: 'Donations', icon: <AccountBalanceWalletIcon /> },
                            { text: 'Visits', icon: <PeopleIcon /> },
                            { text: 'Places to Visit', icon: <HotelIcon /> },
                            { text: 'Quiz', icon: <LiveHelpIcon /> },
                            { text: 'Settings', icon: <SettingsIcon /> },
                        ].filter(item => isSectionEnabled(item.text)).map((item) => (
                            <ListItem
                                button
                                key={item.text}
                                selected={currentTab === item.text}
                                onClick={() => setCurrentTab(item.text)}
                            >
                                <ListItemIcon sx={{ color: currentTab === item.text ? '#ff9800' : '#1a237e' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            fontWeight: currentTab === item.text ? 'bold' : 'normal',
                                            color: currentTab === item.text ? '#ff9800' : '#333'
                                        }
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Container maxWidth="lg">
                    {error && (
                        <Box mb={2} p={2} bgcolor="error.light" color="error.contrastText" borderRadius={1}>
                            <Typography>{error}</Typography>
                        </Box>
                    )}
                    {currentTab === 'Dashboard' && renderDashboard()}
                    {currentTab === 'Devotees' && renderDevotees()}
                    {currentTab === 'News & Updates' && renderNews()}
                    {currentTab === 'Events' && renderEvents()}
                    {currentTab === 'Sevas' && renderSevas()}
                    {currentTab === 'Gallery' && renderGallery()}
                    {currentTab === 'History' && renderHistory()}
                    {currentTab === 'Branches' && renderBranches()}
                    {currentTab === 'Seva Bookings' && renderSevaBookings()}
                    {currentTab === 'Room Bookings' && renderRoomBookings()}
                    {currentTab === 'Donations' && renderDonations()}
                    {currentTab === 'Visits' && renderVisits()}
                    {currentTab === 'Analytics' && renderAnalytics()}
                    {currentTab === 'Settings' && renderSettings()}
                    {currentTab === 'Institutions' && renderInstitutions()}
                    {currentTab === 'Literary Works' && renderLiteraryWorks()}
                    {currentTab === 'Miracles' && renderMiracles()}
                    {currentTab === 'Renovation' && renderRenovation()}
                    {currentTab === 'Videos' && renderVideos()}
                    {currentTab === 'Places to Visit' && renderPlaces()}
                    {currentTab === 'Quiz' && renderQuiz()}
                </Container>
            </Box>

            {/* User Dialog */}
            <Dialog open={openUserDialog} onClose={() => {
                setOpenUserDialog(false);
                setNewUser({
                    name: '', mobileNumber: '', email: '', address: '', role: 'USER',
                    volunteer: false, consentDataStorage: true, consentCommunications: true
                });
            }} maxWidth="sm" fullWidth>
                <DialogTitle>{newUser.id ? 'Edit Devotee' : 'Add Devotee'}</DialogTitle>
                <DialogContent>
                    <Box pt={1}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Name *"
                            fullWidth
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Mobile Number *"
                            fullWidth
                            value={newUser.mobileNumber}
                            onChange={(e) => setNewUser({ ...newUser, mobileNumber: e.target.value })}
                            placeholder="10-digit mobile number"
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Email"
                            type="email"
                            fullWidth
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Address"
                            fullWidth
                            multiline
                            rows={2}
                            value={newUser.address}
                            onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={newUser.role}
                                label="Role"
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'USER' | 'ADMIN' | 'VOLUNTEER' })}
                            >
                                <MenuItem value="USER">User</MenuItem>
                                <MenuItem value="ADMIN">Admin</MenuItem>
                                <MenuItem value="VOLUNTEER">Volunteer</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={newUser.volunteer}
                                    onChange={(e) => setNewUser({ ...newUser, volunteer: e.target.checked })}
                                />
                            }
                            label="Apply for Volunteer (requires approval)"
                            sx={{ mt: 1 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenUserDialog(false);
                        setNewUser({
                            name: '', mobileNumber: '', email: '', address: '', role: 'USER',
                            volunteer: false, consentDataStorage: true, consentCommunications: true
                        });
                    }}>Cancel</Button>
                    <Button
                        onClick={handleSaveUser}
                        variant="contained"
                        disabled={loading || !newUser.name || !newUser.mobileNumber}
                        sx={{ bgcolor: '#ff9800' }}
                    >
                        {newUser.id ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* News Dialog */}
            <Dialog open={openNewsDialog} onClose={() => setOpenNewsDialog(false)}>
                <DialogTitle>Post News / Announcement</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={newNews.title}
                        onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Title (Kannada)"
                        fullWidth
                        value={newNews.titleKa}
                        onChange={(e) => setNewNews({ ...newNews, titleKa: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Content"
                        multiline
                        rows={4}
                        fullWidth
                        value={newNews.content}
                        onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Content (Kannada)"
                        multiline
                        rows={4}
                        fullWidth
                        value={newNews.contentKa}
                        onChange={(e) => setNewNews({ ...newNews, contentKa: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Image URL"
                        fullWidth
                        value={newNews.imageUrl}
                        onChange={(e) => setNewNews({ ...newNews, imageUrl: e.target.value })}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newNews.flashUpdate}
                                onChange={(e) => setNewNews({ ...newNews, flashUpdate: e.target.checked })}
                            />
                        }
                        label="Flash Update (Carousel)"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNewsDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateNews} variant="contained" disabled={loading}>Post</Button>
                </DialogActions>
            </Dialog>

            {/* Event Dialog */}
            <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)}>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Event Title"
                        fullWidth
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        multiline
                        rows={3}
                        fullWidth
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={newEvent.eventDate}
                        onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Location"
                        fullWidth
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEventDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateEvent} variant="contained" disabled={loading}>Create</Button>
                </DialogActions>
            </Dialog>

            {/* Gallery Dialog */}
            <Dialog open={openGalleryDialog} onClose={() => {
                setOpenGalleryDialog(false);
                setNewGalleryItem({ title: '', imageUrl: '', category: 'Deity' });
            }}>
                <DialogTitle>{newGalleryItem.id ? 'Edit Gallery Item' : 'Add to Gallery'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={newGalleryItem.title}
                        onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Image URL"
                        fullWidth
                        value={newGalleryItem.imageUrl}
                        onChange={(e) => setNewGalleryItem({ ...newGalleryItem, imageUrl: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Category"
                        fullWidth
                        value={newGalleryItem.category}
                        onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenGalleryDialog(false);
                        setNewGalleryItem({ title: '', imageUrl: '', category: 'Deity' });
                    }}>Cancel</Button>
                    <Button onClick={handleSaveGalleryItem} variant="contained" disabled={loading} sx={{ bgcolor: '#ff9800' }}>
                        {newGalleryItem.id ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Seva Dialog */}
            <Dialog open={openSevaDialog} onClose={() => setOpenSevaDialog(false)}>
                <DialogTitle>{newSeva.id ? 'Edit Seva' : 'Add New Seva'}</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Seva Name" fullWidth value={newSeva.name} onChange={(e) => setNewSeva({ ...newSeva, name: e.target.value })} />
                    <TextField margin="dense" label="Seva Name (Kannada)" fullWidth value={newSeva.nameKa} onChange={(e) => setNewSeva({ ...newSeva, nameKa: e.target.value })} />
                    <TextField margin="dense" label="Description" fullWidth multiline rows={2} value={newSeva.description} onChange={(e) => setNewSeva({ ...newSeva, description: e.target.value })} />
                    <TextField margin="dense" label="Description (Kannada)" fullWidth multiline rows={2} value={newSeva.descriptionKa} onChange={(e) => setNewSeva({ ...newSeva, descriptionKa: e.target.value })} />
                    <TextField margin="dense" label="Amount (₹)" type="number" fullWidth value={newSeva.amount} onChange={(e) => setNewSeva({ ...newSeva, amount: Number(e.target.value) })} />

                    <FormControl fullWidth margin="dense">
                        <InputLabel>Type</InputLabel>
                        <Select value={newSeva.type} label="Type" onChange={(e) => setNewSeva({ ...newSeva, type: e.target.value as any })}>
                            <MenuItem value="POOJA">Pooja</MenuItem>
                            <MenuItem value="ALANKARA">Alankara</MenuItem>
                            <MenuItem value="RATHOTSAVA">Rathotsava</MenuItem>
                            <MenuItem value="ANNADANA">Annadana</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <InputLabel>Location</InputLabel>
                        <Select value={newSeva.location} label="Location" onChange={(e) => setNewSeva({ ...newSeva, location: e.target.value })}>
                            <MenuItem value="SODE">Sode Matha</MenuItem>
                            <MenuItem value="UDUPI">Udupi Matha</MenuItem>
                            <MenuItem value="BANGALORE">Bangalore Branch</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControlLabel control={<Switch checked={newSeva.active} onChange={(e) => setNewSeva({ ...newSeva, active: e.target.checked })} />} label="Active" sx={{ mt: 2 }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSevaDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveSeva} variant="contained" disabled={loading}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Parampara Dialog */}
            <Dialog open={openParamparaDialog} onClose={() => setOpenParamparaDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>{newParampara.id === 0 ? 'Add Guru' : 'Edit Guru Details'}</DialogTitle>
                <DialogContent>
                    <Box pt={1}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}><TextField label="Name" fullWidth value={newParampara.name} onChange={(e) => setNewParampara({ ...newParampara, name: e.target.value })} /></Grid>
                            <Grid item xs={6}><TextField label="Period" fullWidth value={newParampara.period} onChange={(e) => setNewParampara({ ...newParampara, period: e.target.value })} /></Grid>
                            <Grid item xs={6}><TextField label="Guru" fullWidth value={newParampara.guru} onChange={(e) => setNewParampara({ ...newParampara, guru: e.target.value })} /></Grid>
                            <Grid item xs={6}><TextField label="Shishya" fullWidth value={newParampara.shishya} onChange={(e) => setNewParampara({ ...newParampara, shishya: e.target.value })} /></Grid>
                            <Grid item xs={6}><TextField label="Vrindavana Location" fullWidth value={newParampara.vrindavanaLocation} onChange={(e) => setNewParampara({ ...newParampara, vrindavanaLocation: e.target.value })} /></Grid>
                            <Grid item xs={6}><TextField label="Map URL" fullWidth value={newParampara.vrindavanaUrl} onChange={(e) => setNewParampara({ ...newParampara, vrindavanaUrl: e.target.value })} /></Grid>
                            <Grid item xs={12}>
                                <Typography variant="caption" display="block" gutterBottom>Upload Photo</Typography>
                                <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} />
                            </Grid>
                            <Grid item xs={12}><TextField label="Photo URL (External)" fullWidth value={newParampara.photoUrl} onChange={(e) => setNewParampara({ ...newParampara, photoUrl: e.target.value })} /></Grid>
                            <Grid item xs={12}><TextField label="Description (English)" multiline rows={3} fullWidth value={newParampara.descriptionEn} onChange={(e) => setNewParampara({ ...newParampara, descriptionEn: e.target.value })} /></Grid>
                            <Grid item xs={12}><TextField label="Description (Kannada)" multiline rows={3} fullWidth value={newParampara.descriptionKa} onChange={(e) => setNewParampara({ ...newParampara, descriptionKa: e.target.value })} /></Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenParamparaDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveParampara} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Bhootarajaru Dialog */}
            <Dialog open={openBhootarajaruDialog} onClose={() => setOpenBhootarajaruDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>{newBhootarajaru.id === 0 ? 'Add Entry' : 'Edit Entry'}</DialogTitle>
                <DialogContent>
                    <Box pt={1}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}><TextField label="Name" fullWidth value={newBhootarajaru.name} onChange={(e) => setNewBhootarajaru({ ...newBhootarajaru, name: e.target.value })} /></Grid>
                            <Grid item xs={12}>
                                <Typography variant="caption" display="block" gutterBottom>Upload Photo</Typography>
                                <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} />
                            </Grid>
                            <Grid item xs={12}><TextField label="Description (English)" multiline rows={3} fullWidth value={newBhootarajaru.descriptionEn} onChange={(e) => setNewBhootarajaru({ ...newBhootarajaru, descriptionEn: e.target.value })} /></Grid>
                            <Grid item xs={12}><TextField label="Description (Kannada)" multiline rows={3} fullWidth value={newBhootarajaru.descriptionKa} onChange={(e) => setNewBhootarajaru({ ...newBhootarajaru, descriptionKa: e.target.value })} /></Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBhootarajaruDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveBhootarajaru} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Branch Dialog */}
            <Dialog open={openBranchDialog} onClose={() => setOpenBranchDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{newBranch.id === 0 ? 'Add Branch' : 'Edit Branch'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                            <TextField label="Name (EN)" fullWidth value={newBranch.name} onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Name (KA)" fullWidth value={newBranch.nameKa} onChange={(e) => setNewBranch({ ...newBranch, nameKa: e.target.value })} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Location (EN)" fullWidth value={newBranch.location} onChange={(e) => setNewBranch({ ...newBranch, location: e.target.value })} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Location (KA)" fullWidth value={newBranch.locationKa} onChange={(e) => setNewBranch({ ...newBranch, locationKa: e.target.value })} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Contact" fullWidth value={newBranch.contact} onChange={(e) => setNewBranch({ ...newBranch, contact: e.target.value })} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Email" fullWidth value={newBranch.email} onChange={(e) => setNewBranch({ ...newBranch, email: e.target.value })} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Maps URL" fullWidth value={newBranch.mapUrl} onChange={(e) => setNewBranch({ ...newBranch, mapUrl: e.target.value })} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Image URL" fullWidth value={newBranch.imageUrl} onChange={(e) => setNewBranch({ ...newBranch, imageUrl: e.target.value })} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBranchDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveBranch} variant="contained" sx={{ bgcolor: '#ff9800' }}>Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openInstitutionDialog} onClose={() => setOpenInstitutionDialog(false)}>
                <DialogTitle>{newInstitution.id ? 'Edit' : 'Add'} Institution</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" label="Name" fullWidth value={newInstitution.name} onChange={(e) => setNewInstitution({ ...newInstitution, name: e.target.value })} />
                    <TextField margin="dense" label="Location" fullWidth value={newInstitution.location} onChange={(e) => setNewInstitution({ ...newInstitution, location: e.target.value })} />
                    <TextField margin="dense" label="Website" fullWidth value={newInstitution.website} onChange={(e) => setNewInstitution({ ...newInstitution, website: e.target.value })} />
                    <TextField margin="dense" label="Contact" fullWidth value={newInstitution.contact} onChange={(e) => setNewInstitution({ ...newInstitution, contact: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenInstitutionDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveInstitution} variant="contained" sx={{ bgcolor: '#ff9800' }}>Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openLiteraryDialog} onClose={() => setOpenLiteraryDialog(false)}>
                <DialogTitle>{newLiteraryWork.id ? 'Edit' : 'Add'} Literary Work</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" label="Title (EN)" fullWidth value={newLiteraryWork.title} onChange={(e) => setNewLiteraryWork({ ...newLiteraryWork, title: e.target.value })} />
                    <TextField margin="dense" label="Title (KA)" fullWidth value={newLiteraryWork.titleKa} onChange={(e) => setNewLiteraryWork({ ...newLiteraryWork, titleKa: e.target.value })} />
                    <TextField margin="dense" label="Category" fullWidth value={newLiteraryWork.category} onChange={(e) => setNewLiteraryWork({ ...newLiteraryWork, category: e.target.value })} />
                    <TextField margin="dense" label="Description" fullWidth multiline rows={2} value={newLiteraryWork.description} onChange={(e) => setNewLiteraryWork({ ...newLiteraryWork, description: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenLiteraryDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveLiteraryWork} variant="contained" sx={{ bgcolor: '#ff9800' }}>Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openMiracleDialog} onClose={() => setOpenMiracleDialog(false)}>
                <DialogTitle>{newMiracle.id ? 'Edit' : 'Add'} Miracle</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" label="Title" fullWidth value={newMiracle.title} onChange={(e) => setNewMiracle({ ...newMiracle, title: e.target.value })} />
                    <TextField margin="dense" label="Description (EN)" fullWidth multiline rows={3} value={newMiracle.descriptionEn} onChange={(e) => setNewMiracle({ ...newMiracle, descriptionEn: e.target.value })} />
                    <TextField margin="dense" label="Description (KA)" fullWidth multiline rows={3} value={newMiracle.descriptionKa} onChange={(e) => setNewMiracle({ ...newMiracle, descriptionKa: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenMiracleDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveMiracle} variant="contained" sx={{ bgcolor: '#ff9800' }}>Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openRenovationDialog} onClose={() => setOpenRenovationDialog(false)}>
                <DialogTitle>Update Renovation</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" label="Update Title" fullWidth value={newRenovation.title} onChange={(e) => setNewRenovation({ ...newRenovation, title: e.target.value })} />
                    <TextField margin="dense" label="Description" fullWidth multiline rows={2} value={newRenovation.description} onChange={(e) => setNewRenovation({ ...newRenovation, description: e.target.value })} />
                    <TextField margin="dense" label="Collected Amount" type="number" fullWidth value={newRenovation.collectedAmount} onChange={(e) => setNewRenovation({ ...newRenovation, collectedAmount: Number(e.target.value) })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRenovationDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveRenovationUpdate} variant="contained" sx={{ bgcolor: '#ff9800' }}>Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openVideoDialog} onClose={() => setOpenVideoDialog(false)}>
                <DialogTitle>{newVideo.id ? 'Edit' : 'Add'} Video</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" label="Title (EN)" fullWidth value={newVideo.title} onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })} />
                    <TextField margin="dense" label="Title (KA)" fullWidth value={newVideo.titleKa} onChange={(e) => setNewVideo({ ...newVideo, titleKa: e.target.value })} />
                    <TextField margin="dense" label="Category" fullWidth value={newVideo.category} onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })} />
                    <TextField margin="dense" label="Video URL" fullWidth value={newVideo.videoUrl} onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })} />
                    <TextField margin="dense" label="Thumbnail URL" fullWidth value={newVideo.thumbnailUrl} onChange={(e) => setNewVideo({ ...newVideo, thumbnailUrl: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenVideoDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveVideo} variant="contained" sx={{ bgcolor: '#ff9800' }}>Save</Button>
                </DialogActions>
            </Dialog>
            {/* Quiz Dialog */}
            <Dialog open={openQuizDialog} onClose={() => setOpenQuizDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{newQuestion.id ? 'Edit Question' : 'Add Question'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense" label="Question" fullWidth
                        multiline rows={2}
                        value={newQuestion.question}
                        onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField margin="dense" label="Option A" fullWidth value={newQuestion.optionA} onChange={(e) => setNewQuestion({ ...newQuestion, optionA: e.target.value })} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField margin="dense" label="Option B" fullWidth value={newQuestion.optionB} onChange={(e) => setNewQuestion({ ...newQuestion, optionB: e.target.value })} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField margin="dense" label="Option C" fullWidth value={newQuestion.optionC} onChange={(e) => setNewQuestion({ ...newQuestion, optionC: e.target.value })} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField margin="dense" label="Option D" fullWidth value={newQuestion.optionD} onChange={(e) => setNewQuestion({ ...newQuestion, optionD: e.target.value })} />
                        </Grid>
                    </Grid>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Correct Answer</InputLabel>
                        <Select
                            value={newQuestion.correctAnswer}
                            label="Correct Answer"
                            onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                        >
                            <MenuItem value="A">Option A</MenuItem>
                            <MenuItem value="B">Option B</MenuItem>
                            <MenuItem value="C">Option C</MenuItem>
                            <MenuItem value="D">Option D</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Language</InputLabel>
                        <Select
                            value={newQuestion.language}
                            label="Language"
                            onChange={(e) => setNewQuestion({ ...newQuestion, language: e.target.value })}
                        >
                            <MenuItem value="EN">English</MenuItem>
                            <MenuItem value="KA">Kannada</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenQuizDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveQuizQuestion} variant="contained" disabled={loading}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Places Dialog */}
            <Dialog open={openPlaceDialog} onClose={() => setOpenPlaceDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{newPlace.id ? 'Edit' : 'Add'} Place to Visit</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" label="Name (EN)" fullWidth value={newPlace.name} onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })} />
                    <TextField margin="dense" label="Name (KA)" fullWidth value={newPlace.nameKa} onChange={(e) => setNewPlace({ ...newPlace, nameKa: e.target.value })} />
                    <TextField margin="dense" label="Description (EN)" multiline rows={3} fullWidth value={newPlace.descriptionEn} onChange={(e) => setNewPlace({ ...newPlace, descriptionEn: e.target.value })} />
                    <TextField margin="dense" label="Description (KA)" multiline rows={3} fullWidth value={newPlace.descriptionKa} onChange={(e) => setNewPlace({ ...newPlace, descriptionKa: e.target.value })} />
                    <TextField margin="dense" label="Distance (e.g. 5km)" fullWidth value={newPlace.distance} onChange={(e) => setNewPlace({ ...newPlace, distance: e.target.value })} />
                    <TextField margin="dense" label="Image URL" fullWidth value={newPlace.imageUrl} onChange={(e) => setNewPlace({ ...newPlace, imageUrl: e.target.value })} />
                    <TextField margin="dense" label="Map URL" fullWidth value={newPlace.mapUrl} onChange={(e) => setNewPlace({ ...newPlace, mapUrl: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPlaceDialog(false)}>Cancel</Button>
                    <Button onClick={handleSavePlace} variant="contained" sx={{ bgcolor: '#ff9800' }}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default App;
