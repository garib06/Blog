'use client'
import { useTheme } from 'next-themes';
import { ThemeSwitcher } from './theme-switcher';

export default function Navbar() {
    const { theme, setTheme } = useTheme();

    return (
        <nav style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: theme === 'dark' ? '#222' : '#f5f5f5',
            color: theme === 'dark' ? '#fff' : '#222'
        }}>
            <div style={{ fontWeight: 'bold' }}>My Blog</div>
            <ThemeSwitcher />
        </nav>
    );
}