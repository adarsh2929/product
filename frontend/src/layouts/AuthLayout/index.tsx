import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const AuthLayout = () => {  
    const authpath = ["/"];
    const { pathname } = useLocation();
    const path = window.location.pathname;
    const navigate = useNavigate();
    useEffect(() => {
        if (!authpath.includes(path)) {
            navigate('/');
        }
    }, [pathname,]);



    return (
        <div>
            <Outlet />
        </div>
    )
    
}
