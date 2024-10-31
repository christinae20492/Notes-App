import { LoadingOutlined } from '@ant-design/icons'

export default function loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div><LoadingOutlined style={{animation:'spin', scale:1, color:'white'}}/></div>
    </div>
  )
}
