import { createTheme, type PaletteMode } from '@mui/material/styles'

export const getAppTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    ...(mode === 'dark' ? {
      primary: {
        main: '#5EE6FF',
      },
      secondary: {
        main: '#7A8CFF',
      },
      background: {
        default: '#0B1020',
        paper: '#121A2F',
      },
      success: {
        main: '#3DDC97',
      },
      warning: {
        main: '#FFB648',
      },
      error: {
        main: '#FF6B7A',
      },
      text: {
        primary: '#EAF0FF',
        secondary: '#A9B5D6',
      },
    } : {
      primary: {
        main: '#007AFF', // Xanh dương hiện đại, tươi sáng hơn
      },
      secondary: {
        main: '#5856D6',
      },
      background: {
        default: '#F9FAFB', // Nền xám cực nhẹ để làm nổi bật các thẻ trắng
        paper: '#FFFFFF',   // Các panel màu trắng tinh khiết
      },
      text: {
        primary: '#111827', // Đen đậm cho tiêu đề
        secondary: '#4B5563', // Xám đậm cho nội dung phụ
      },
      divider: 'rgba(0, 0, 0, 0.06)',
    }),
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: '"IBM Plex Sans", sans-serif',
    h1: {
      fontFamily: '"Epilogue", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Epilogue", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: '"Epilogue", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Epilogue", sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Epilogue", sans-serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Epilogue", sans-serif',
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: mode === 'dark' ? '1px solid rgba(169, 181, 214, 0.18)' : '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: mode === 'light' ? '0 1px 3px 0 rgba(0, 0, 0, 0.05)' : 'none',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 14,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
  },
})
