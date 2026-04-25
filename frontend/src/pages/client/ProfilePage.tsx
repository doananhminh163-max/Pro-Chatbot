import { useMemo, useState } from 'react'
import { isAxiosError } from 'axios'
import {
  Alert,
  Avatar,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import { useAuth } from '../../hooks/useAuth'

export default function ProfilePage() {
  const { user, saveProfile } = useAuth()

  const [username, setUsername] = useState(user?.username ?? '')
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [avatar, setAvatar] = useState(user?.avatar ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const isDirty = useMemo(
    () =>
      username !== (user?.username ?? '') ||
      fullName !== (user?.fullName ?? '') ||
      phone !== (user?.phone ?? '') ||
      avatar !== (user?.avatar ?? ''),
    [avatar, fullName, phone, user?.avatar, user?.fullName, user?.phone, user?.username, username],
  )

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError('')
      setMessage('')

      await saveProfile({
        username,
        fullName,
        phone,
        avatar,
      })

      setMessage('Profile updated successfully.')
    } catch (requestError) {
      if (isAxiosError<{ message?: string }>(requestError)) {
        setError(requestError.response?.data?.message ?? 'Unable to update profile.')
      } else {
        setError('Unexpected error while updating profile.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Stack spacing={3} className="profile-page">
      <Paper className="profile-form-card" variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Profile Details</Typography>

          {error ? <Alert severity="error">{error}</Alert> : null}
          {message ? <Alert severity="success">{message}</Alert> : null}

          <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
            <Avatar src={avatar} sx={{ width: 100, height: 100, border: '1px solid var(--border-soft)' }}>
              {fullName.charAt(0)}
            </Avatar>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Profile Photo</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Update your profile picture to help people recognize you.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  component="label"
                  startIcon={<CloudUploadRoundedIcon />}
                >
                  Upload image
                  <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                </Button>
                {avatar && (
                  <Button
                    variant="text"
                    size="small"
                    color="error"
                    onClick={() => setAvatar('')}
                    startIcon={<DeleteRoundedIcon />}
                  >
                    Remove
                  </Button>
                )}
              </Stack>
            </Stack>
          </Stack>

          <TextField label="Email" value={user?.email ?? ''} disabled fullWidth />
          <TextField
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            fullWidth
          />
          <TextField
            label="Full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            fullWidth
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            fullWidth
          />

          <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
            <Button variant="contained" disabled={!isDirty || isSaving} onClick={handleSave}>
              Save profile
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper className="profile-meta-card" variant="outlined">
        <Typography variant="body2" color="text.secondary">
          Current role: <strong>{user?.role ?? 'CLIENT'}</strong>
        </Typography>
      </Paper>
    </Stack>
  )
}
