import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import Sidebar from "./components/common/Sidebar";
import ProfilePage from "./pages/profile/ProfilePage";

function App() {
	return (
		<div className='flex max-w-6xl mx-auto'>
			{/* Common component, bc it's not wrapped with Routes */}
			<Sidebar />
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/profile/:username' element={<ProfilePage />} />
			</Routes>
		</div>
	);
}

export default App;