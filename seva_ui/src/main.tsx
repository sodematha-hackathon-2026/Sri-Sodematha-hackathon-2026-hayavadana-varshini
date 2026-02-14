import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './style.css'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: '#ff9800', // Saffron color
        },
        secondary: {
            main: '#5d4037', // Brown
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    }
});

ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>,
)
