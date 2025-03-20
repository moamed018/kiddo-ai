import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AppHome from "./pages/AppHome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AppLayout from "./pages/AppLayout";
import NewStory from "./pages/NewStory";
import NewLesson from "./pages/NewLesson";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/app" element={<AppLayout />}>
                    <Route path="" element={<AppHome />} />
                    <Route path="new-story" element={<NewStory />} />
                    <Route path="new-lesson" element={<NewLesson />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
