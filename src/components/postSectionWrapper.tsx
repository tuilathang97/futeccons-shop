import { cn } from "@/lib/utils"

function PostSectionWrapper({ children ,className}: { children: React.ReactNode ,className?:string }) {
    return (
        <div className={cn("p-4 bg-white border border-gray-200 rounded-md w-full min-h-[2rem]",className)}>
            {children}
        </div>
    )
}

export default PostSectionWrapper