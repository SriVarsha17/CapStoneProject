function Footer() {
    return (
        <footer className="mt-auto border-t border-slate-200 bg-white py-5">
            <p className="text-center text-sm text-slate-500">
                {new Date().getFullYear()} Blog Application
            </p>
        </footer>
    );
}

export default Footer;