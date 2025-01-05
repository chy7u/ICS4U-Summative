import './Footer.css';

function Footer() {

    return (
        <div>
            <div className="faqs">
                <h1 className="footer-head">Frequently Asked Questions</h1>
                <div className="accordion">
                    <details>
                        <summary>What is Notflix?</summary>
                        <p>A free movie streaming website! :3</p>
                    </details>
        
                    <details>
                        <summary>How do I cancel my subscription?</summary>
                        <p>It's free, silly.</p>
                    </details>
        
                    <details>
                        <summary>Is Notflix suitable for children?</summary>
                        <p>Up to you...</p>
                    </details>
                    <details>
                        <summary>How is this website free?</summary>
                        <p>Hey, don't ask too many questions...</p>
                    </details>
                </div>
            </div>
            <div className="misc">
                <div className="links">
                    <ul>
                        <li><a href="https://github.com/chy7u/Assignment-Two" target="_blank">Github</a></li>
                        <li><a href="https://mail.google.com/mail/u/0/#inbox" target="_blank">Email</a></li>
                        <li><a href="https://classroom.google.com/" target="_blank">Google Classroom</a></li>
                        <li>
                            <p>👋</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Footer;