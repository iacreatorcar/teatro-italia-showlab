'use client'

import dynamic from 'next/dynamic'

const FeedbackForm = dynamic(() => import('@/src/components/FeedbackForm'), { ssr: false })

export default function SurveyPage() {
  return <FeedbackForm />
}
