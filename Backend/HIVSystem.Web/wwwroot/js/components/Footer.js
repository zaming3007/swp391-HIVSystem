const Footer = () => {
    return React.createElement('footer', { className: 'border-top footer text-muted' },
        React.createElement('div', { className: 'container' },
            '© 2025 - HIV Healthcare System - ',
            React.createElement('a', {
                href: '#',
                onClick: (e) => { e.preventDefault(); window.navigateTo('/privacy'); }
            }, 'Privacy')
        )
    );
}; 