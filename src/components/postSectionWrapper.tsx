function PostSectionWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-4 bg-white border border-gray-200 rounded-md w-full min-h-[2rem]">
            {children}
        </div>
    )
}

export default PostSectionWrapper