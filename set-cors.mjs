import { readFileSync } from 'fs'
import { Storage } from '@google-cloud/storage'

const serviceAccount = JSON.parse(readFileSync('./serviceAccount.json', 'utf8'))
const BUCKET = 'wexi-ed3da.appspot.com'

const storage = new Storage({
  credentials: serviceAccount,
  projectId: serviceAccount.project_id,
})

const corsConfig = [
  {
    origin: ['*'],
    method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
    maxAgeSeconds: 3600,
    responseHeader: [
      'Content-Type',
      'Authorization',
      'Content-Length',
      'User-Agent',
      'x-goog-resumable',
    ],
  },
]

console.log(`Configurando CORS en bucket: ${BUCKET}`)
await storage.bucket(BUCKET).setCorsConfiguration(corsConfig)
console.log('✅ CORS configurado correctamente.')
console.log('Ahora puedes subir imágenes desde localhost.')
