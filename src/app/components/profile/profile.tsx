'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { useAuth } from '@/app/supabase-AuthProvider'
import { useRouter } from 'next/navigation'
import { signOut } from '../signout/SignOut'
import useStore from '../../../../store'

const schema = z.object({
  name: z.string().min(2, { message: '２文字以上入力する必要があります。' }),
  introduce: z.string().optional(),
})

type Schema = z.infer<typeof schema>

const Profile = () => {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState('')
  const [message, setMessage] = useState('')
  const [fileMessage, setFileMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingLogout, setLoadingLogout] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const { user } = useAuth()
  const { profile } = useStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Schema>({
    defaultValues: {
      name: '',
      introduce: '',
    },
    resolver: zodResolver(schema),
  })

  if (!user) {
    return <div className="text-center mt-10">プロフィールを読み込み中...</div>
  }

  console.log({profile})

  useEffect(() => {
    if (profile) {
        setAvatarUrl(profile.avatar_url || '')
        setValue('name', profile.name || '')
        setValue('introduce', profile.introduce || '')
      }
    }, [profile, setValue])

  const onUploadImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setFileMessage('')

    if (!files || files.length === 0) {
      setFileMessage('画像をアップロードしてください')
      return
    }

    const file = files[0]
    const fileSize = file.size / 1024 / 1024
    const fileType = file.type

    if (fileSize > 2) {
      setFileMessage('画像サイズを2MB以下にしてください')
      return
    }

    if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
      setFileMessage('画像はjpgまたはpng形式である必要があります。')
      return
    }

    const formData = new FormData()
    formData.append('avatar', file)

    const res = await fetch('/api/profile/upload', {
      method: 'POST',
      body: formData,
    })

    const result = await res.json()

    if (!res.ok) {
      setFileMessage(result.error || 'アップロードに失敗しました')
      return
    }

    setAvatarUrl(result.avatar_url)
  }, [])

  const onSubmit = async (data: Schema) => {
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/profile/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        avatar_url: avatarUrl,
      }),
    })

    const result = await res.json()
    setLoading(false)

    if (!res.ok) {
      setMessage(result.error || '更新に失敗しました')
      return
    }

    setMessage(result.message)
    setIsEdit(false) // 編集→表示に戻る
  }

  const logout = async () => {
    setLoadingLogout(true)
    await signOut()
    router.push('/')
    setLoadingLogout(false)
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-center mb-6">プロフィール</h2>

      {isEdit ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center mb-4">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src={avatarUrl ? avatarUrl : '/default.png'}
              alt="avatar"
              className="rounded-full object-cover"
              fill
            />
          </div>
            <input type="file" accept="image/*" onChange={onUploadImage} />
            {fileMessage && <p className="text-sm text-red-500 mt-2">{fileMessage}</p>}
          </div>

          <div className="mb-4">
            <label className="text-sm font-bold">名前</label>
            <input
              className="w-full p-2 border rounded"
              {...register('name')}
              placeholder="名前"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="mb-4">
            <label className="text-sm font-bold">自己紹介</label>
            <textarea
              className="w-full p-2 border rounded"
              rows={4}
              {...register('introduce')}
              placeholder="自己紹介"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-sky-500 text-white p-2 rounded hover:brightness-110"
            >
              {loading ? '更新中...' : '更新'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEdit(false)
                setMessage('')
              }}
              className="flex-1 bg-gray-300 p-2 rounded"
            >
              キャンセル
            </button>
          </div>

          {message && <p className="text-center text-sm text-red-500 mt-4">{message}</p>}
        </form>
      ) : (
        <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src={avatarUrl ? avatarUrl : '/default.png'}
              alt="avatar"
              className="rounded-full object-cover"
              fill
            />
          </div>
          <p className="text-lg font-bold">{profile.name}</p>
          <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{profile.introduce}</p>

          <button
            onClick={() => setIsEdit(true)}
            className="mt-4 bg-sky-500 text-white px-4 py-2 rounded hover:brightness-110"
          >
            プロフィールを編集
          </button>
        </div>
      )}

      <div className="text-center mt-6">
        {loadingLogout ? (
          <div>少々お待ちください・・</div>
        ) : (
          <div className="inline-block text-red-500 cursor-pointer" onClick={logout}>
            ログアウト
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile