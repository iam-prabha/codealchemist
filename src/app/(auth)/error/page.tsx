"use client";

import { Suspense } from "react";
import AuthErrorPageContent from "./AuthErrorPageContent";

function AuthErrorPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthErrorPageContent />
        </Suspense>
    );
}

export default AuthErrorPage;