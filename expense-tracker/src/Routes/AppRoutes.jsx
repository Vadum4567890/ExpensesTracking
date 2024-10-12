import { Route, Routes } from "react-router-dom";
import HomePage from "../components/HomePage";
import { ROUTES } from "../utils/routes";
import CategoryPage from "../components/CategoryPage";
import PageNotFound from "../components/PageNotFound";

const AppRoutes = () => (
    <Routes>
        <Route index element={<HomePage/>}/>
        <Route path={ROUTES.CATEGORY} element={<CategoryPage/>}/>
        <Route path={ROUTES.ERROR} element={<PageNotFound />}/>
    
    </Routes>
)
export default AppRoutes;