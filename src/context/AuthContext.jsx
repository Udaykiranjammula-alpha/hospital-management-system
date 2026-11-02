import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, getRoleConfig, playSound } from '../data/mockData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(() => {
        const role = localStorage.getItem('hms_user_role') || 'Admin';
        const loginCategory = localStorage.getItem('hms_login_category') || (role === 'Doctor' ? 'DOCTOR' : (role === 'Admin' ? 'ADMIN' : 'STAFF'));
        const username = localStorage.getItem('hms_username') || 'Administrator';
        const doctorId = localStorage.getItem('hms_doctor_id') || (role === 'Doctor' ? 'D001' : '');
        const department = localStorage.getItem('hms_department') || (role === 'Doctor' ? 'Cardiology' : 'Hospital Operations');
        const avatar = localStorage.getItem('hms_user_avatar') || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=0284c7&color=fff`;
        return { role, loginCategory, username, displayName: username, doctorId, department, avatar };
    });

    const [accessDeniedModal, setAccessDeniedModal] = useState({ isOpen: false, title: '', message: '' });

    useEffect(() => {
        localStorage.setItem('hms_user_role', currentUser.role);
        localStorage.setItem('hms_login_category', currentUser.loginCategory);
        localStorage.setItem('hms_username', currentUser.username);
        localStorage.setItem('hms_doctor_id', currentUser.doctorId || '');
        localStorage.setItem('hms_department', currentUser.department || '');
        localStorage.setItem('hms_user_avatar', currentUser.avatar);
    }, [currentUser]);

    const login = (category, username, role, doctorId = '', department = '') => {
        playSound('success');
        const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=0284c7&color=fff`;
        const newUser = {
            loginCategory: category,
            username,
            displayName: username,
            role,
            doctorId,
            department: department || (role === 'Doctor' ? 'Cardiology' : 'Operations'),
            avatar
        };
        setCurrentUser(newUser);
        return newUser;
    };

    const logout = () => {
        playSound('click');
        localStorage.removeItem('hms_user_role');
        localStorage.removeItem('hms_username');
        localStorage.removeItem('hms_login_category');
        setCurrentUser({
            role: 'Admin',
            loginCategory: 'ADMIN',
            username: 'Administrator',
            displayName: 'Administrator',
            doctorId: '',
            department: 'Hospital Administration',
            avatar: 'https://ui-avatars.com/api/?name=Administrator&background=0284c7&color=fff'
        });
    };

    const hasPermission = (permName) => {
        const cfg = getRoleConfig(currentUser.role);
        return Boolean(cfg?.permissions?.[permName]);
    };

    const checkActionPermission = (permName, actionDesc) => {
        if (!hasPermission(permName)) {
            playSound('error');
            setAccessDeniedModal({
                isOpen: true,
                title: actionDesc || 'Action Restricted',
                message: `Your active persona (${currentUser.displayName} — ${currentUser.role}) does not have administrative authorization to execute this operation.`
            });
            return false;
        }
        return true;
    };

    const closeAccessDeniedModal = () => {
        setAccessDeniedModal({ isOpen: false, title: '', message: '' });
    };

    const switchRole = (newRole) => {
        playSound('click');
        let cat = 'STAFF';
        let uname = 'Staff User';
        let dept = 'Hospital Operations';
        let docId = '';

        if (newRole === 'Admin') {
            cat = 'ADMIN';
            uname = 'Administrator';
        } else if (newRole === 'Doctor') {
            cat = 'DOCTOR';
            uname = 'Dr. Priya Sharma';
            dept = 'Cardiology';
            docId = 'D001';
        } else if (newRole === 'Receptionist') {
            cat = 'STAFF';
            uname = 'Pooja Das';
            dept = 'Front Desk & Admissions';
        } else if (newRole === 'Pharmacist') {
            cat = 'STAFF';
            uname = 'Sushma Singh';
            dept = 'Central Pharmacy';
        } else if (newRole === 'LabTechnician') {
            cat = 'STAFF';
            uname = 'Ravi Kumar';
            dept = 'Pathology Diagnostics';
        }

        login(cat, uname, newRole, docId, dept);
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            roleConfig: getRoleConfig(currentUser.role),
            login,
            logout,
            hasPermission,
            checkActionPermission,
            switchRole,
            accessDeniedModal,
            closeAccessDeniedModal
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
