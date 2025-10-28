import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="container my-5">
            {/* Hero Section */}
            <div className="text-center mb-5 mt-24 pt-10">
                <h1 className="heading">Terms & Conditions</h1>
                <p className="text-muted fs-5">Understand your rights and responsibilities while using Gateway Abroad’s website.</p>
            </div>

            {/* Accordion Section */}
            <div className="accordion" id="termsAccordion">
                <div className="accordion-item border-0 mb-3 shadow-sm">
                    <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                            1. Acceptance of Terms
                        </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#termsAccordion">
                        <div className="accordion-body">
                            By accessing this website, you agree to comply with and be bound by these terms and conditions, along with our Privacy Policy.
                        </div>
                    </div>
                </div>

                <div className="accordion-item border-0 mb-3 shadow-sm">
                    <h2 className="accordion-header" id="headingTwo">
                        <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                            2. Company Information
                        </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#termsAccordion">
                        <div className="accordion-body">
                            The term <strong>Gateway Abroad Education Pvt. Ltd.</strong> or "us"/"we" refers to the owner of this website with registered office at:
                            <br />
                            <em>105,first floor,  Geetanjali Tower, Ajmer Road,  Civil Lines, Jaipur.</em>.
                        </div>
                    </div>
                </div>

                <div className="accordion-item border-0 mb-3 shadow-sm">
                    <h2 className="accordion-header" id="headingThree">
                        <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                            3. Use of Content
                        </button>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#termsAccordion">
                        <div className="accordion-body">
                            All materials including layout, design, graphics, and content are owned by or licensed to us. Unauthorized use is prohibited.
                        </div>
                    </div>
                </div>

                <div className="accordion-item border-0 mb-3 shadow-sm">
                    <h2 className="accordion-header" id="headingFour">
                        <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour">
                            4. External Links & Liability
                        </button>
                    </h2>
                    <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#termsAccordion">
                        <div className="accordion-body">
                            We are not responsible for the content of linked websites. Any reliance on external information is at your own risk.
                        </div>
                    </div>
                </div>

                <div className="accordion-item border-0 mb-3 shadow-sm">
                    <h2 className="accordion-header" id="headingFive">
                        <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive">
                            5. Legal Jurisdiction
                        </button>
                    </h2>
                    <div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#termsAccordion">
                        <div className="accordion-body">
                            Use of this website is governed by the laws of India. Disputes shall be subject to the jurisdiction of Indian courts.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
