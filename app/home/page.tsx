import React from 'react'
import {ModeToggle} from "@/components/ThemeToggle";

const Page = () => {
    return (
        <div>Page
            <ModeToggle/>
            <div className="bg-white text-black dark:bg-red-300 dark:text-white">
                This is some content that changes with dark mode.
            </div>
        </div>
    )
}
export default Page
