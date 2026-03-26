--
-- PostgreSQL database dump
--

\restrict pyos7729BzpPHJci3fgPmbViv3cDYscppRWVjc8ygF0ZXwfJMoeu7gXd2W7SK2X

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.9 (Ubuntu 17.9-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: franchises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.franchises (id, name, city, region, address, phone, whatsapp) FROM stdin;
FR01	Anna Nagar - Chennai	Chennai	Chennai	3rd Avenue, Anna Arch Rd, next to K3 Police Station, Anna Nagar, Chennai, Tamil Nadu 600106	+919344103536	+919344103536
FR02	Ambatur - Chennai	Chennai	Chennai	21/9, Redhills Main Rd, Ram Nagar, Oragadam, Chennai, Tamil Nadu 600053	+919176423771	+919176423771
FR03	Avadi - Chennai	Chennai	Chennai	No 89/2, Avadi - Poonamallee High Road (Opp. Vivekananda School), Avadi Chennai - 600054	+919962852879	+919962852879
FR04	Ekattuthangal - Chennai	Chennai	Chennai	17/17, Pallavan St, near Metro Station, Poomagal Nagar, Ekkatuthangal, Chennai, Tamil Nadu 600032	+918939395339	+918939395339
FR05	Karaiyansabadi - Chennai	Chennai	Chennai	CK Complx No:59, Trunk Road, Karayanchavadi, Poonamallee, Chennai, India, Tamil Nadu	+918667839903	+918667839903
FR06	Kolathur - Chennai	Chennai	Chennai	36/37 First Floor, Redhills High Road, Samdaria Colony, Kolathur, Chennai, Tamil Nadu 600099	+918248818088	+918248818088
FR07	Senthil Nagar - Chennai	Chennai	Chennai	50, Vivekananda Nagar Main Road, Mohammed Hussain Colony, Senthil Nagar, Kolathur, Chennai 600099	+918438038035	+918438038035
FR08	Perambur - Chennai	Chennai	Chennai	312, Paper Mills Road, Bunder Garden, Perambur, Chennai, Tamil Nadu 600011	+919384918879	+919384918879
FR09	Madhavaram - Chennai	Chennai	Chennai	Victory Field, 4, Extn, Madhavaram, Tamil Nadu 600060	+919342069691	+919342069691
FR10	T. Nagar - Chennai	Chennai	Chennai	2/25, Habibullah Rd, Rama Kamath Puram, T. Nagar, Chennai, Tamil Nadu 600017	+918220177120	+918220177120
FR11	Nolambur - Chennai	Chennai	Chennai	Ground Floor, 144, 4th Main Rd, opp. to Navasakthi Vinayagar temple, Nolambur Phase 1, LIG, Nolambur, Ambattur Industrial Estate, Chennai, Tamil Nadu 600037	+919150677740	+919150677740
FR12	Thiruttani - Chennai	Thiruttani	Chennai	No 34/99, MPS Salai (Opp. Thalapathy K. Vinayagam School), Tiruttani - 631209, Thiruvallur District	+918220098245	+918220098245
FR13	Saibaba Colony - Coimbatore	Coimbatore	Coimbatore	Shop no 56, ARPEE Center, 320n, NSR Rd, Saibaba Colony, Coimbatore, Tamil Nadu 641011	+919500801223	+919500801223
FR14	RS Puram - Coimbatore	Coimbatore	Coimbatore	First Floor, Sukrawarpet, 225, Kyochi Foot Refexology, Sukrawarpet St, Coimbatore, Tamil Nadu 641001	+917695881010	+917695881010
FR15	Ramanathapuram - Coimbatore	Coimbatore	Coimbatore	4, Sowripalayam Pirivu, Ramanathapuram, Coimbatore, Tamil Nadu 641045	+919994308286	+919994308286
FR16	Saravanampatti - Coimbatore	Coimbatore	Coimbatore	2nd floor, Sri Hari Complex, opp. to Prozone mall, Saravanampatti, Coimbatore, Tamil Nadu 641035	+916369091522	+916369091522
FR17	Thoothukudi	Thoothukudi	Thoothukudi	II Floor, Annai Residency, Chinnakanupuram, near New Bus Stand, Thoothukudi, Tamil Nadu 628002	+919952464999	+919952464999
FR18	Kumbakonam	Kumbakonam	Kumbakonam	No: 138, John Selvaraj Nagar Rd, near Bus Stand, John Selvaraj Nagar, Kumbakonam, Tamil Nadu 612001	+919361813349	+919361813349
FR19	Mayiladuthurai	Mayiladuthurai	Mayiladuthurai	69, Mahadhana St, Kamarajar Salai, Mayiladuthurai, Tamil Nadu 609001	+919715355561	+919715355561
FR20	Trichy	Tiruchirappalli	Trichy	31A, 3, Salai Rd, Woraiyur, Tiruchirappalli, Tamil Nadu 620003	+917200879972	+917200879972
FR21	Thanjavur	Thanjavur	Thanjavur	Door no 969, Neithal St, behind Moghal Biriyani, Naga, New Housing Unit, Thanjavur, Tamil Nadu 613005	+917339011691	+917339011691
FR22	Theni	Theni	Theni	Vedha Towers, W8/283/25, near KTM showroom, Eswar Nagar, Eswar, Vadaveeranaickenpatty, Tamil Nadu 625531	+919543187123	+919543187123
FR23	S.S. Colony - Madurai	Madurai	Madurai	29/1, Subramaniya Pillai St, S S Colony, Madurai, Tamil Nadu 625016	+917639584931	+917639584931
FR24	Salem	Salem	Salem	Baskara Plazza, 22/A, Murugan Kovil St, Fairlands, Salem, Tamil Nadu 636016	+917845962397	+917845962397
FR25	Pondicherry	Puducherry	Pondicherry	79-93, Muthu Mariamman Kovil St, Heritage Town, Puducherry, 605001	+919789259540	+919789259540
\.


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patients (id, franchise_id, full_name, email, phone, dob, wellness_score, status) FROM stdin;
PAT01	FR01	Eleanor Shellstrop	eleanor@kyochi.example	+1-555-0101	1992-02-14	78	active
PAT02	FR02	Tahani Al-Jamil	tahani@kyochi.example	+1-555-0102	1988-08-20	84	active
PAT03	FR03	Chidi Anagonye	chidi@kyochi.example	+1-555-0103	1990-11-03	69	active
PAT04	FR04	Janet Rivera	janet@kyochi.example	+1-555-0104	1995-04-09	73	active
PAT05	FR05	Marcus Lin	marcus@kyochi.example	+1-555-0105	1986-09-12	81	active
PAT06	FR06	Nora Patel	nora@kyochi.example	+1-555-0106	1993-06-27	76	active
PAT07	FR07	Ibrahim Khan	ibrahim@kyochi.example	+1-555-0107	1989-01-31	67	active
PAT08	FR08	Sofia Morales	sofia@kyochi.example	+1-555-0108	1997-12-05	88	active
PAT09	FR09	Aarav Sharma	patient09@kyochi.example	+1-555-2009	1980-01-01	60	active
PAT10	FR10	Ananya Sharma	patient10@kyochi.example	+1-555-2010	1981-02-02	61	active
PAT11	FR11	Vihaan Iyer	patient11@kyochi.example	+1-555-2011	1982-03-03	62	active
PAT12	FR12	Diya Iyer	patient12@kyochi.example	+1-555-2012	1983-04-04	63	active
PAT13	FR13	Arjun Menon	patient13@kyochi.example	+1-555-2013	1984-05-05	64	active
PAT14	FR14	Isha Menon	patient14@kyochi.example	+1-555-2014	1985-06-06	65	active
PAT15	FR15	Reyansh Patel	patient15@kyochi.example	+1-555-2015	1986-07-07	66	active
PAT16	FR16	Meera Patel	patient16@kyochi.example	+1-555-2016	1987-08-08	67	active
PAT17	FR17	Kabir Rao	patient17@kyochi.example	+1-555-2017	1988-09-09	68	active
PAT18	FR18	Naina Rao	patient18@kyochi.example	+1-555-2018	1989-10-10	69	active
PAT19	FR19	Rohan Nair	patient19@kyochi.example	+1-555-2019	1990-11-11	70	active
PAT20	FR20	Aditi Nair	patient20@kyochi.example	+1-555-2020	1991-12-12	71	active
PAT21	FR21	Dev Singh	patient21@kyochi.example	+1-555-2021	1992-01-13	72	active
PAT22	FR22	Saanvi Singh	patient22@kyochi.example	+1-555-2022	1993-02-14	73	active
PAT23	FR23	Ishan Kapoor	patient23@kyochi.example	+1-555-2023	1994-03-15	74	active
PAT24	FR24	Kavya Kapoor	patient24@kyochi.example	+1-555-2024	1995-04-16	75	active
PAT25	FR25	Varun Khan	patient25@kyochi.example	+1-555-2025	1996-05-17	76	active
PAT27	FR02	Neel Das	patient27@kyochi.example	+1-555-2027	1998-07-19	78	active
PAT28	FR03	Tara Das	patient28@kyochi.example	+1-555-2028	1999-08-20	79	active
PAT29	FR04	Aarav Gupta	patient29@kyochi.example	+1-555-2029	1980-09-21	80	active
PAT30	FR05	Ananya Gupta	patient30@kyochi.example	+1-555-2030	1981-10-22	81	active
PAT31	FR06	Vihaan Joshi	patient31@kyochi.example	+1-555-2031	1982-11-23	82	active
PAT32	FR07	Diya Joshi	patient32@kyochi.example	+1-555-2032	1983-12-24	83	active
PAT33	FR08	Arjun Verma	patient33@kyochi.example	+1-555-2033	1984-01-25	84	active
PAT34	FR09	Isha Verma	patient34@kyochi.example	+1-555-2034	1985-02-26	85	active
PAT35	FR10	Reyansh Bose	patient35@kyochi.example	+1-555-2035	1986-03-27	86	active
PAT36	FR11	Meera Bose	patient36@kyochi.example	+1-555-2036	1987-04-01	87	active
PAT37	FR12	Kabir Malhotra	patient37@kyochi.example	+1-555-2037	1988-05-02	88	active
PAT38	FR13	Naina Malhotra	patient38@kyochi.example	+1-555-2038	1989-06-03	89	active
PAT39	FR14	Rohan Chopra	patient39@kyochi.example	+1-555-2039	1990-07-04	90	active
PAT40	FR15	Aditi Chopra	patient40@kyochi.example	+1-555-2040	1991-08-05	91	active
PAT41	FR16	Dev Pillai	patient41@kyochi.example	+1-555-2041	1992-09-06	92	active
PAT42	FR17	Saanvi Pillai	patient42@kyochi.example	+1-555-2042	1993-10-07	93	active
PAT43	FR18	Ishan Bhat	patient43@kyochi.example	+1-555-2043	1994-11-08	94	active
PAT44	FR19	Kavya Bhat	patient44@kyochi.example	+1-555-2044	1995-12-09	60	active
PAT45	FR20	Varun Saxena	patient45@kyochi.example	+1-555-2045	1996-01-10	61	active
PAT46	FR21	Maya Saxena	patient46@kyochi.example	+1-555-2046	1997-02-11	62	active
PAT47	FR22	Neel Sen	patient47@kyochi.example	+1-555-2047	1998-03-12	63	active
PAT48	FR23	Tara Sen	patient48@kyochi.example	+1-555-2048	1999-04-13	64	active
PAT263914849	FR01	Maddy	P001@gmail.com	3503203543	2026-03-21	0	active
PAT26	FR01	Maya Khan	patient26@kyochi.example	+1-555-2026	1997-06-18	100	active
PAT5483421441	FR01	raj	raj@gmail.com	34235255425235	2026-03-22	0	active
PAT5491452521	FR01	raj	raj@gmail.com	34235255425235	2026-03-22	0	active
PAT263914850	FR01	Eleanor Shellstrop	abc@gmail.com	76789870	2026-03-21	100	active
PAT5491452522	FR01	Zendon Targaryen	zendonify@gmail.com	7448624928	2005-05-04	100	active
PAT263914851	FR01	Siraj	sir@gmail.com	2344556763	2005-03-08	100	active
PAT263914852	FR01	nithish	nithe@gmail.com	8780984732	2026-03-21	0	active
\.


--
-- Data for Name: therapists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.therapists (id, franchise_id, full_name, email, specialty, license_no, status) FROM stdin;
THR01	FR01	Dr. Aris Menon	aris@kyochi.example	CBT	TX-THER-101	active
THR02	FR02	Dr. Mira Kapoor	mira@kyochi.example	Stress Therapy	TX-THER-102	active
THR03	FR06	Dr. Priya Menon	priya@kyochi.example	Mindfulness	TX-THER-103	active
THR04	FR05	Dr. Samir Das	samir@kyochi.example	Trauma Therapy	TX-THER-104	active
THR05	FR09	Dr. Diya Nair	therapist05@kyochi.example	CBT	TX-THER-105	active
THR06	FR10	Dr. Arjun Singh	therapist06@kyochi.example	Stress Therapy	TX-THER-106	active
THR07	FR11	Dr. Isha Kapoor	therapist07@kyochi.example	Mindfulness	TX-THER-107	active
THR08	FR12	Dr. Reyansh Khan	therapist08@kyochi.example	Trauma Therapy	TX-THER-108	active
THR09	FR13	Dr. Meera Das	therapist09@kyochi.example	Sleep Therapy	TX-THER-109	active
THR10	FR14	Dr. Kabir Gupta	therapist10@kyochi.example	Behavioral Therapy	TX-THER-110	active
THR11	FR15	Dr. Naina Joshi	therapist11@kyochi.example	CBT	TX-THER-111	active
THR12	FR16	Dr. Rohan Verma	therapist12@kyochi.example	Stress Therapy	TX-THER-112	active
THR13	FR17	Dr. Aditi Bose	therapist13@kyochi.example	Mindfulness	TX-THER-113	active
THR14	FR18	Dr. Dev Malhotra	therapist14@kyochi.example	Trauma Therapy	TX-THER-114	active
THR15	FR19	Dr. Saanvi Chopra	therapist15@kyochi.example	Sleep Therapy	TX-THER-115	active
THR16	FR20	Dr. Ishan Pillai	therapist16@kyochi.example	Behavioral Therapy	TX-THER-116	active
THR17	FR21	Dr. Kavya Bhat	therapist17@kyochi.example	CBT	TX-THER-117	active
THR18	FR22	Dr. Varun Saxena	therapist18@kyochi.example	Stress Therapy	TX-THER-118	active
THR19	FR23	Dr. Maya Sen	therapist19@kyochi.example	Mindfulness	TX-THER-119	active
THR20	FR24	Dr. Neel Sharma	therapist20@kyochi.example	Trauma Therapy	TX-THER-120	active
THR21	FR25	Dr. Tara Iyer	therapist21@kyochi.example	Sleep Therapy	TX-THER-121	active
THR22	FR01	Dr. Aarav Menon	therapist22@kyochi.example	Behavioral Therapy	TX-THER-122	active
THR23	FR02	Dr. Ananya Patel	therapist23@kyochi.example	CBT	TX-THER-123	active
THR24	FR03	Dr. Vihaan Rao	therapist24@kyochi.example	Stress Therapy	TX-THER-124	active
THR25	FR04	Dr. Diya Nair	therapist25@kyochi.example	Mindfulness	TX-THER-125	active
THR26	FR05	Dr. Arjun Singh	therapist26@kyochi.example	Trauma Therapy	TX-THER-126	active
THR27	FR06	Dr. Isha Kapoor	therapist27@kyochi.example	Sleep Therapy	TX-THER-127	active
THR28	FR07	Dr. Reyansh Khan	therapist28@kyochi.example	Behavioral Therapy	TX-THER-128	active
THR29	FR08	Dr. Meera Das	therapist29@kyochi.example	CBT	TX-THER-129	active
THR30	FR09	Dr. Kabir Gupta	therapist30@kyochi.example	Stress Therapy	TX-THER-130	active
THR31	FR10	Dr. Naina Joshi	therapist31@kyochi.example	Mindfulness	TX-THER-131	active
THR32	FR11	Dr. Rohan Verma	therapist32@kyochi.example	Trauma Therapy	TX-THER-132	active
THR33	FR12	Dr. Aditi Bose	therapist33@kyochi.example	Sleep Therapy	TX-THER-133	active
THR34	FR13	Dr. Dev Malhotra	therapist34@kyochi.example	Behavioral Therapy	TX-THER-134	active
THR35	FR14	Dr. Saanvi Chopra	therapist35@kyochi.example	CBT	TX-THER-135	active
THR36	FR15	Dr. Ishan Pillai	therapist36@kyochi.example	Stress Therapy	TX-THER-136	active
THR37	FR16	Dr. Kavya Bhat	therapist37@kyochi.example	Mindfulness	TX-THER-137	active
THR38	FR17	Dr. Varun Saxena	therapist38@kyochi.example	Trauma Therapy	TX-THER-138	active
THR39	FR18	Dr. Maya Sen	therapist39@kyochi.example	Sleep Therapy	TX-THER-139	active
THR40	FR19	Dr. Neel Sharma	therapist40@kyochi.example	Behavioral Therapy	TX-THER-140	active
THR41	FR20	Dr. Tara Iyer	therapist41@kyochi.example	CBT	TX-THER-141	active
THR42	FR21	Dr. Aarav Menon	therapist42@kyochi.example	Stress Therapy	TX-THER-142	active
THR43	FR22	Dr. Ananya Patel	therapist43@kyochi.example	Mindfulness	TX-THER-143	active
THR44	FR23	Dr. Vihaan Rao	therapist44@kyochi.example	Trauma Therapy	TX-THER-144	active
\.


--
-- Data for Name: app_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.app_users (id, auth_user_id, full_name, email, role, status, franchise_id, therapist_id, patient_id) FROM stdin;
d13fbacb-8c15-42ca-8954-218b26040e16	d13fbacb-8c15-42ca-8954-218b26040e16	yogesh.xcode	yogesh.xcode@gmail.com	admin	active	\N	\N	\N
f0578336-a79a-409b-a68f-ef7876eb5f7d	f0578336-a79a-409b-a68f-ef7876eb5f7d	pawfect107	pawfect107@gmail.com	franchisee	active	FR01	\N	\N
fc5c3096-6ee2-43de-89d5-4c4f0970a4ff	fc5c3096-6ee2-43de-89d5-4c4f0970a4ff	Dr. Aris Menon	mrhyper608@gmail.com	therapist	active	FR01	THR01	\N
39e677f6-11ee-42fc-b710-96ebad134961	39e677f6-11ee-42fc-b710-96ebad134961	Zendon Targaryen	zendonify@gmail.com	patient	active	FR01	\N	PAT5491452522
\.


--
-- Data for Name: access_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.access_requests (id, requester_user_id, requester_name, requester_email, requested_role, requested_franchise_id, status, message, assigned_role, assigned_therapist_id, decided_by_user_id, decided_at, created_at) FROM stdin;
628ac2e8-1a44-40f3-89e4-e59b34113c8e	fc5c3096-6ee2-43de-89d5-4c4f0970a4ff	mrhyper608	mrhyper608@gmail.com	therapist	\N	approved	Requesting therapist context assignment.	therapist	THR01	d13fbacb-8c15-42ca-8954-218b26040e16	2026-03-20 16:17:13.495+00	2026-03-20 16:16:36.39131+00
63c0b484-ca0a-482a-b99b-a6243d363492	f0578336-a79a-409b-a68f-ef7876eb5f7d	pawfect107	pawfect107@gmail.com	therapist	\N	approved	Requesting therapist context assignment.	franchisee	\N	d13fbacb-8c15-42ca-8954-218b26040e16	2026-03-20 19:06:15.061+00	2026-03-20 19:05:35.328372+00
\.


--
-- Data for Name: therapies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.therapies (id, name, category, duration_min, session_count, status, description, price, feedback_schema) FROM stdin;
THP01	Relaxation Reflexology	Relaxation	30	6	active	A gentle rhythmic treatment targeting key reflex points to release muscle tension, ease anxiety, and calm the nervous system.	500	{"Q1_stress_after": "range", "Q3_rested_score": "range", "Q1_stress_before": "range", "Q4_therapist_note": "text", "Q2_circulation_improvement": "radio"}
THP02	De-Stress Reflexology	Stress Relief	30	6	active	Focused on stress-sensitive zones to regulate breathing, reduce cortisol response, and restore mental clarity.	600	{"Q3_energy_after": "range", "Q3_energy_before": "range", "Q1_mental_calm_score": "range", "Q4_peace_contributor": "text", "Q2_physical_tension_relief": "radio"}
THP03	Chronic Pain Reflexology	Pain Management	30	8	active	Designed for long-term pain conditions by stimulating reflex points linked to inflammation, nerves, and joint function.	650	{"Q1_pain_area": "multiselect", "Q2_pain_after": "range", "Q2_pain_before": "range", "Q4_sessions_completed": "dropdown", "Q3_mobility_improvement": "radio", "Q4_cumulative_improvement": "radio"}
THP04	Sole Serenity Therapy	Foot Wellness	60	5	active	A deeply grounding foot-focused session to revitalize tired feet and support full-body harmony.	950	{"Q3_standout_note": "text", "Q1_mental_stillness": "radio", "Q3_standout_element": "checkbox", "Q2_emotional_balance_score": "range", "Q4_therapist_connection_score": "range"}
THP05	Detox Reflexology	Detox	60	6	active	Targets liver, kidneys, and lymphatic pathways to support circulation and natural toxin elimination.	1100	{"Q4_water_intake": "boolean", "Q3_refreshed_score": "range", "Q2_cumulative_score": "range", "Q1_lightness_or_release": "radio", "Q2_digestion_energy_change": "radio"}
THP06	Femme Cycle Reflexology	Women's Wellness	62	8	active	Supports menstrual and hormonal balance by stimulating reproductive and endocrine reflex zones.	0	{"Q3_last_cycle_date": "date", "Q3_cycle_compliance": "boolean", "Q1_cramp_hormonal_relief": "radio", "Q2_emotional_balance_score": "range", "Q4_menstrual_regularity_change": "radio"}
THP08	Little Feet Reflexology (Kids)	Pediatric	30	6	active	A gentle child-safe reflexology session aimed at sleep, digestion, and emotional calm for children aged 3-12.	450	{"Q2_symptom_relief": "radio", "Q1_child_calm_score": "range", "Q3_child_mood_score": "range", "Q4_followup_scheduled": "boolean"}
THP10	Vita Flex Reflexology	Energy Therapy	60	6	active	A Tibetan-inspired rolling reflex technique often paired with oils to stimulate energy flow and deep reset.	1100	{"Q3_mood_tag": "multiselect", "Q1_vitality_score": "range", "Q2_muscle_tension_relief": "radio", "Q4_cumulative_improvement": "radio"}
THP09	Nasal Reflexology	Respiratory	60	5	active	Focuses on sinus-clearing points to improve airflow, ease congestion, and support respiratory comfort.	1100	{"Q2_sinus_relief": "radio", "Q1_breathing_ease": "radio", "Q4_sinus_frequency": "dropdown", "Q3_respiratory_after": "range", "Q3_respiratory_before": "range"}
THP07	Face Detox Reflexology	Facial Reflexology	30	5	active	Combines acupressure and lymphatic activation to improve skin tone, reduce puffiness, and relieve facial tension.	850	{"Q1_skin_sensation": "radio", "Q2_circulation_glow": "radio", "Q4_combine_next_time": "boolean", "Q3_rejuvenation_score": "range", "Q4_combine_therapy_choice": "dropdown"}
\.


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (id, franchise_id, patient_id, therapist_id, therapy_id, starts_at, status) FROM stdin;
APT5491499744	FR01	PAT5491452521	THR01	THP01	2026-03-22 04:50:00+00	waiting
AP837257557	FR01	PAT26	THR01	THP01	2026-03-21 07:33:00+00	completed
AP837257559	FR01	PAT26	THR01	THP01	2026-03-12 06:04:00+00	completed
ROW1774164058632	FR01	PAT5491452522	THR01	THP01	2026-03-21 19:25:00+00	completed
AP837257561	FR01	PAT26	THR01	THP02	2026-03-21 06:19:00+00	completed
ROW1774164058633	FR01	PAT5491452522	THR01	THP04	2026-03-22 08:20:00+00	completed
AP837257565	FR01	PAT26	THR01	THP02	2026-03-21 07:05:00+00	completed
AP837257563	FR01	PAT26	THR01	THP03	2026-03-21 06:29:00+00	completed
AP837257567	FR01	PAT26	THR01	THP07	2026-03-14 07:41:00+00	completed
AP837257569	FR01	PAT26	THR01	THP10	2026-03-21 07:45:00+00	completed
AP02	FR02	PAT02	THR02	THP01	2026-02-20 05:00:00+00	completed
AP04	FR04	PAT04	THR03	THP03	2026-02-24 08:30:00+00	completed
AP05	FR05	PAT05	THR04	THP04	2026-02-26 11:00:00+00	completed
AP06	FR06	PAT06	THR03	THP03	2026-03-01 02:45:00+00	completed
AP07	FR07	PAT07	THR04	THP02	2026-03-03 06:30:00+00	completed
AP08	FR08	PAT08	THR02	THP01	2026-03-05 09:30:00+00	completed
AP10	FR02	PAT02	THR03	THP03	2026-03-10 07:45:00+00	completed
AP11	FR06	PAT06	THR03	THP03	2026-03-14 11:30:00+00	completed
AP12	FR05	PAT05	THR04	THP04	2026-03-17 13:15:00+00	completed
AP13	FR04	PAT04	THR02	THP02	2026-03-19 04:30:00+00	in_progress
AP15	FR09	PAT09	THR05	THP01	2026-03-21 03:30:00+00	completed
AP16	FR10	PAT10	THR06	THP02	2026-03-22 05:00:00+00	completed
AP17	FR11	PAT11	THR07	THP03	2026-03-23 05:30:00+00	completed
AP18	FR12	PAT12	THR08	THP04	2026-03-24 07:00:00+00	in_progress
AP19	FR13	PAT13	THR09	THP01	2026-03-25 07:30:00+00	waiting
AP20	FR14	PAT14	THR10	THP02	2026-03-26 09:00:00+00	completed
AP21	FR15	PAT15	THR11	THP03	2026-03-27 09:30:00+00	completed
AP22	FR16	PAT16	THR12	THP04	2026-03-28 11:00:00+00	completed
AP23	FR17	PAT17	THR13	THP01	2026-04-01 11:30:00+00	in_progress
AP24	FR18	PAT18	THR14	THP02	2026-04-02 04:00:00+00	waiting
AP25	FR19	PAT19	THR15	THP03	2026-04-03 04:30:00+00	completed
AP26	FR20	PAT20	THR16	THP04	2026-04-04 06:00:00+00	completed
AP27	FR21	PAT21	THR17	THP01	2026-04-05 06:30:00+00	completed
AP28	FR22	PAT22	THR18	THP02	2026-04-06 08:00:00+00	in_progress
AP29	FR23	PAT23	THR19	THP03	2026-04-07 08:30:00+00	waiting
AP30	FR24	PAT24	THR20	THP04	2026-04-08 10:00:00+00	completed
AP31	FR25	PAT25	THR21	THP01	2026-04-09 10:30:00+00	completed
AP32	FR01	PAT26	THR22	THP02	2026-04-10 12:00:00+00	completed
AP33	FR02	PAT27	THR23	THP03	2026-04-11 03:30:00+00	in_progress
AP34	FR03	PAT28	THR24	THP04	2026-04-12 05:00:00+00	waiting
AP35	FR04	PAT29	THR25	THP01	2026-04-13 05:30:00+00	completed
AP36	FR05	PAT30	THR26	THP02	2026-04-14 07:00:00+00	completed
AP37	FR06	PAT31	THR27	THP03	2026-04-15 07:30:00+00	completed
AP38	FR07	PAT32	THR28	THP04	2026-04-16 09:00:00+00	in_progress
AP39	FR08	PAT33	THR29	THP01	2026-04-17 09:30:00+00	waiting
AP837257572	FR01	PAT263914851	THR01	THP01	2026-03-21 11:50:00+00	completed
AP837257576	FR02	PAT263914850	THR02	THP04	2026-03-21 14:20:00+00	waiting
AP837257574	FR01	PAT26	THR01	THP01	2026-03-21 13:26:00+00	completed
AP40	FR09	PAT34	THR30	THP02	2026-04-18 11:00:00+00	completed
AP41	FR10	PAT35	THR31	THP03	2026-04-19 11:30:00+00	completed
AP42	FR11	PAT36	THR32	THP04	2026-04-20 04:00:00+00	completed
AP43	FR12	PAT37	THR33	THP01	2026-04-21 04:30:00+00	in_progress
AP44	FR13	PAT38	THR34	THP02	2026-04-22 06:00:00+00	waiting
AP45	FR14	PAT39	THR35	THP03	2026-04-23 06:30:00+00	completed
AP46	FR15	PAT40	THR36	THP04	2026-04-24 08:00:00+00	completed
AP47	FR16	PAT41	THR37	THP01	2026-04-25 08:30:00+00	completed
AP48	FR17	PAT42	THR38	THP02	2026-04-26 10:00:00+00	in_progress
AP49	FR18	PAT43	THR39	THP03	2026-04-27 10:30:00+00	waiting
AP50	FR19	PAT44	THR40	THP04	2026-04-28 12:00:00+00	completed
AP51	FR20	PAT45	THR41	THP01	2026-05-01 03:30:00+00	completed
AP52	FR21	PAT46	THR42	THP02	2026-05-02 05:00:00+00	completed
AP53	FR22	PAT47	THR43	THP03	2026-05-03 05:30:00+00	in_progress
AP54	FR23	PAT48	THR44	THP04	2026-05-04 07:00:00+00	waiting
AP03	FR03	PAT03	THR01	THP02	2026-03-20 06:15:00+00	completed
AP09	FR01	PAT01	THR01	THP01	2026-03-09 04:00:00+00	completed
AP14	FR03	PAT03	THR01	THP02	2026-03-19 06:00:00+00	completed
AP837257544	FR01	PAT26	THR01	THP01	2026-03-15 05:00:00+00	completed
AP837257558	FR01	PAT26	THR01	THP01	2026-03-21 06:00:00+00	completed
AP837257545	FR01	PAT01	THR01	THP06	2026-03-21 03:00:00+00	completed
AP837257546	FR01	PAT263914849	THR01	THP01	2026-03-21 03:15:00+00	completed
AP837257560	FR01	PAT26	THR01	THP01	2026-03-21 06:10:00+00	completed
AP837257547	FR01	PAT03	THR01	THP01	2026-03-21 03:30:00+00	completed
APT5491499746	FR01	PAT5491452522	THR01	THP01	2026-03-22 07:56:00+00	completed
AP837257548	FR01	PAT01	THR01	THP01	2026-03-21 03:25:00+00	completed
AP837257562	FR01	PAT26	THR01	THP01	2026-03-21 06:27:00+00	completed
AP837257549	FR01	PAT263914850	THR01	THP01	2026-03-20 03:40:00+00	completed
AP837257550	FR01	PAT263914851	THR01	THP01	2026-03-21 04:05:00+00	completed
AP837257564	FR01	PAT26	THR01	THP02	2026-03-21 06:49:00+00	completed
APT5491499745	FR01	PAT263914850	THR01	THP01	2026-03-22 05:54:00+00	completed
ROW1774164058634	FR01	PAT5491452522	THR01	THP01	2026-03-22 08:40:00+00	waiting
AP837257551	FR01	PAT26	THR01	THP01	2026-03-21 04:50:00+00	completed
AP837257566	FR01	PAT26	THR01	THP07	2026-03-20 07:40:00+00	completed
AP837257552	FR01	PAT263914849	THR01	THP01	2026-03-21 04:48:00+00	completed
AP837257553	FR01	PAT263914849	THR01	THP01	2026-03-21 05:40:00+00	completed
AP837257568	FR01	PAT26	THR01	THP06	2026-03-20 07:45:00+00	completed
AP837257554	FR01	PAT26	THR01	THP01	2026-03-21 05:55:00+00	completed
AP837257555	FR01	PAT26	THR01	THP01	2026-03-21 05:48:00+00	completed
AP837257556	FR01	PAT26	THR01	THP01	2026-03-21 05:55:00+00	completed
AP837257570	FR01	PAT26	THR01	THP01	2026-03-21 11:50:00+00	completed
AP837257571	FR01	PAT26	THR01	THP01	2026-03-21 12:05:00+00	completed
AP837257573	FR01	PAT26	THR01	THP01	2026-03-21 12:48:00+00	completed
AP837257575	FR01	PAT26	THR01	THP03	2026-03-21 14:20:00+00	completed
\.


--
-- Data for Name: billing; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.billing (id, appointment_id, patient_id, amount, currency, due_date, status, franchise_id) FROM stdin;
INV02	AP02	PAT02	260	USD	2026-02-22	paid	FR02
INV04	AP04	PAT04	280	USD	2026-02-27	paid	FR04
INV05	AP05	PAT05	210	USD	2026-03-02	paid	FR05
INV06	AP08	PAT08	300	USD	2026-03-07	paid	FR08
INV07	AP11	PAT06	240	USD	2026-03-16	unpaid	FR06
INV09	AP15	PAT09	180	USD	2026-03-23	paid	FR09
INV10	AP16	PAT10	200	USD	2026-03-24	paid	FR10
INV11	AP17	PAT11	220	USD	2026-03-25	unpaid	FR11
INV12	AP18	PAT12	240	USD	2026-03-26	unpaid	FR12
INV13	AP19	PAT13	260	USD	2026-03-27	paid	FR13
INV14	AP20	PAT14	280	USD	2026-03-28	paid	FR14
INV15	AP21	PAT15	300	USD	2026-04-01	unpaid	FR15
INV16	AP22	PAT16	320	USD	2026-04-02	unpaid	FR16
INV17	AP23	PAT17	180	USD	2026-04-03	paid	FR17
INV18	AP24	PAT18	200	USD	2026-04-04	paid	FR18
INV19	AP25	PAT19	220	USD	2026-04-05	unpaid	FR19
in-ap837257567	AP837257567	PAT26	0	INR	2026-03-28	paid	FR01
in-ap837257569	AP837257569	PAT26	0	INR	2026-03-28	paid	FR01
in-ap837257572	AP837257572	PAT263914851	230	INR	2026-03-28	unpaid	FR01
in-ap837257571	AP837257571	PAT26	230	INR	2026-03-28	unpaid	FR01
in-ap837257574	AP837257574	PAT26	500	INR	2026-03-29	unpaid	FR01
in-row1774164058632	ROW1774164058632	PAT5491452522	500	INR	2026-03-29	unpaid	FR01
in-apt5491499745	APT5491499745	PAT263914850	500	INR	2026-03-29	unpaid	FR01
INV20	AP26	PAT20	240	USD	2026-04-06	unpaid	FR20
INV21	AP27	PAT21	260	USD	2026-04-07	paid	FR21
INV22	AP28	PAT22	280	USD	2026-04-08	paid	FR22
INV23	AP29	PAT23	300	USD	2026-04-09	unpaid	FR23
INV24	AP30	PAT24	320	USD	2026-04-10	unpaid	FR24
INV25	AP31	PAT25	180	USD	2026-04-11	paid	FR25
INV26	AP32	PAT26	200	USD	2026-04-12	paid	FR01
INV27	AP33	PAT27	220	USD	2026-04-13	unpaid	FR02
INV28	AP34	PAT28	240	USD	2026-04-14	unpaid	FR03
INV29	AP35	PAT29	260	USD	2026-04-15	paid	FR04
INV30	AP36	PAT30	280	USD	2026-04-16	paid	FR05
INV31	AP37	PAT31	300	USD	2026-04-17	unpaid	FR06
INV32	AP38	PAT32	320	USD	2026-04-18	unpaid	FR07
INV33	AP39	PAT33	180	USD	2026-04-19	paid	FR08
INV34	AP40	PAT34	200	USD	2026-04-20	paid	FR09
INV35	AP41	PAT35	220	USD	2026-04-21	unpaid	FR10
INV36	AP42	PAT36	240	USD	2026-04-22	unpaid	FR11
INV37	AP43	PAT37	260	USD	2026-04-23	paid	FR12
INV38	AP44	PAT38	280	USD	2026-04-24	paid	FR13
INV39	AP45	PAT39	300	USD	2026-04-25	unpaid	FR14
INV40	AP46	PAT40	320	USD	2026-04-26	unpaid	FR15
INV41	AP47	PAT41	180	USD	2026-04-27	paid	FR16
INV42	AP48	PAT42	200	USD	2026-04-28	paid	FR17
INV43	AP49	PAT43	220	USD	2026-05-01	unpaid	FR18
INV44	AP50	PAT44	240	USD	2026-05-02	unpaid	FR19
INV45	AP51	PAT45	260	USD	2026-05-03	paid	FR20
INV46	AP52	PAT46	280	USD	2026-05-04	paid	FR21
INV47	AP53	PAT47	300	USD	2026-05-05	unpaid	FR22
INV48	AP54	PAT48	320	USD	2026-05-06	unpaid	FR23
INV03	AP03	PAT03	220	USD	2026-02-24	paid	FR03
INV08	AP14	PAT03	250	USD	2026-03-18	paid	FR03
in-ap837257545	AP837257545	PAT01	230	INR	2026-03-28	unpaid	FR01
in-ap837257546	AP837257546	PAT263914849	230	INR	2026-03-28	unpaid	FR01
in-ap837257547	AP837257547	PAT03	230	INR	2026-03-28	unpaid	FR01
in-ap837257548	AP837257548	PAT01	230	INR	2026-03-28	unpaid	FR01
in-ap837257549	AP837257549	PAT263914850	230	INR	2026-03-28	unpaid	FR01
in-ap837257550	AP837257550	PAT263914851	230	INR	2026-03-28	unpaid	FR01
in-ap837257568	AP837257568	PAT26	0	INR	2026-03-28	paid	FR01
in-ap837257551	AP837257551	PAT26	230	INR	2026-03-28	paid	FR01
in-ap837257570	AP837257570	PAT26	230	INR	2026-03-28	unpaid	FR01
in-ap837257573	AP837257573	PAT26	230	INR	2026-03-28	unpaid	FR01
in-ap837257575	AP837257575	PAT26	650	INR	2026-03-29	unpaid	FR01
in-apt5491499746	APT5491499746	PAT5491452522	500	INR	2026-03-29	unpaid	FR01
in-row1774164058633	ROW1774164058633	PAT5491452522	950	INR	2026-03-29	unpaid	FR01
\.


--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feedback (id, appointment_id, patient_id, therapist_id, session_date, rating, status, notes, franchise_id, invoice_id, submitted_at, attachment_path, feedback_payload) FROM stdin;
fb-ap837257574	AP837257574	PAT26	THR01	2026-03-21 13:26:00+00	\N	pending	\N	FR01	\N	\N	\N	\N
fb-ap837257575	AP837257575	PAT26	THR01	2026-03-21 14:20:00+00	\N	pending	\N	FR01	\N	\N	\N	\N
fb-row1774164058632	ROW1774164058632	PAT5491452522	THR01	2026-03-21 19:25:00+00	4	completed	{"final_rating": 4, "Q1_stress_after": 2, "Q3_rested_score": 6, "Q1_stress_before": 5, "Q4_therapist_note": "I Prefer little lighter pressure next session.", "Q2_circulation_improvement": "Moderate"}	FR01	\N	2026-03-22 07:52:32.153+00	\N	{"final_rating": 4, "Q1_stress_after": 2, "Q3_rested_score": 6, "Q1_stress_before": 5, "Q4_therapist_note": "I Prefer little lighter pressure next session.", "Q2_circulation_improvement": "Moderate"}
fb-apt5491499745	APT5491499745	PAT263914850	THR01	2026-03-22 05:54:00+00	\N	pending	\N	FR01	\N	\N	\N	\N
fb-apt5491499746	APT5491499746	PAT5491452522	THR01	2026-03-22 07:56:00+00	4	completed	{"final_rating": 4, "Q1_stress_after": 4, "Q3_rested_score": 8, "Q1_stress_before": 9, "Q4_therapist_note": "good", "Q2_circulation_improvement": "High"}	FR01	\N	2026-03-22 07:57:29.048+00	\N	{"final_rating": 4, "Q1_stress_after": 4, "Q3_rested_score": 8, "Q1_stress_before": 9, "Q4_therapist_note": "good", "Q2_circulation_improvement": "High"}
fb-row1774164058633	ROW1774164058633	PAT5491452522	THR01	2026-03-22 08:20:00+00	2	completed	{"final_rating": 2, "Q3_standout_note": "great", "Q1_mental_stillness": "Somewhat", "Q3_standout_element": ["Aroma"], "Q2_emotional_balance_score": 9, "Q4_therapist_connection_score": 8}	FR01	\N	2026-03-22 08:00:34.666+00	\N	{"final_rating": 2, "Q3_standout_note": "great", "Q1_mental_stillness": "Somewhat", "Q3_standout_element": ["Aroma"], "Q2_emotional_balance_score": 9, "Q4_therapist_connection_score": 8}
fb-ap837257545	AP837257545	PAT01	THR01	2026-03-21 03:00:00+00	\N	pending	\N	FR01	\N	\N	\N	\N
FDBK02	AP02	PAT02	THR02	2026-02-20 05:00:00+00	\N	pending	\N	FR02	\N	\N	\N	\N
FDBK04	AP04	PAT04	THR03	2026-02-24 08:30:00+00	\N	pending	\N	FR04	\N	\N	\N	\N
FDBK05	AP05	PAT05	THR04	2026-02-26 11:00:00+00	\N	pending	\N	FR05	\N	\N	\N	\N
FDBK06	AP06	PAT06	THR03	2026-03-01 02:45:00+00	\N	pending	\N	FR06	\N	\N	\N	\N
FDBK07	AP07	PAT07	THR04	2026-03-03 06:30:00+00	\N	pending	\N	FR07	\N	\N	\N	\N
FDBK08	AP08	PAT08	THR02	2026-03-05 09:30:00+00	\N	pending	\N	FR08	\N	\N	\N	\N
FDBK10	AP10	PAT02	THR03	2026-03-10 07:45:00+00	\N	pending	\N	FR02	\N	\N	\N	\N
FDBK11	AP11	PAT06	THR03	2026-03-14 11:30:00+00	\N	pending	\N	FR06	\N	\N	\N	\N
FDBK12	AP12	PAT05	THR04	2026-03-17 13:15:00+00	\N	pending	\N	FR05	\N	\N	\N	\N
FDBK13	AP13	PAT04	THR02	2026-03-19 04:30:00+00	\N	pending	\N	FR04	\N	\N	\N	\N
FDBK15	AP15	PAT09	THR05	2026-03-21 03:30:00+00	\N	pending	\N	FR09	\N	\N	\N	\N
FDBK16	AP16	PAT10	THR06	2026-03-22 05:00:00+00	\N	pending	\N	FR10	\N	\N	\N	\N
FDBK17	AP17	PAT11	THR07	2026-03-23 05:30:00+00	\N	pending	\N	FR11	\N	\N	\N	\N
FDBK18	AP18	PAT12	THR08	2026-03-24 07:00:00+00	\N	pending	\N	FR12	\N	\N	\N	\N
FDBK19	AP19	PAT13	THR09	2026-03-25 07:30:00+00	\N	pending	\N	FR13	\N	\N	\N	\N
FDBK20	AP20	PAT14	THR10	2026-03-26 09:00:00+00	\N	pending	\N	FR14	\N	\N	\N	\N
FDBK21	AP21	PAT15	THR11	2026-03-27 09:30:00+00	\N	pending	\N	FR15	\N	\N	\N	\N
FDBK22	AP22	PAT16	THR12	2026-03-28 11:00:00+00	\N	pending	\N	FR16	\N	\N	\N	\N
FDBK23	AP23	PAT17	THR13	2026-04-01 11:30:00+00	\N	pending	\N	FR17	\N	\N	\N	\N
FDBK24	AP24	PAT18	THR14	2026-04-02 04:00:00+00	\N	pending	\N	FR18	\N	\N	\N	\N
FDBK25	AP25	PAT19	THR15	2026-04-03 04:30:00+00	\N	pending	\N	FR19	\N	\N	\N	\N
FDBK26	AP26	PAT20	THR16	2026-04-04 06:00:00+00	\N	pending	\N	FR20	\N	\N	\N	\N
FDBK27	AP27	PAT21	THR17	2026-04-05 06:30:00+00	\N	pending	\N	FR21	\N	\N	\N	\N
FDBK28	AP28	PAT22	THR18	2026-04-06 08:00:00+00	\N	pending	\N	FR22	\N	\N	\N	\N
FDBK29	AP29	PAT23	THR19	2026-04-07 08:30:00+00	\N	pending	\N	FR23	\N	\N	\N	\N
FDBK30	AP30	PAT24	THR20	2026-04-08 10:00:00+00	\N	pending	\N	FR24	\N	\N	\N	\N
FDBK31	AP31	PAT25	THR21	2026-04-09 10:30:00+00	\N	pending	\N	FR25	\N	\N	\N	\N
FDBK32	AP32	PAT26	THR22	2026-04-10 12:00:00+00	\N	pending	\N	FR01	\N	\N	\N	\N
FDBK33	AP33	PAT27	THR23	2026-04-11 03:30:00+00	\N	pending	\N	FR02	\N	\N	\N	\N
FDBK34	AP34	PAT28	THR24	2026-04-12 05:00:00+00	\N	pending	\N	FR03	\N	\N	\N	\N
FDBK35	AP35	PAT29	THR25	2026-04-13 05:30:00+00	\N	pending	\N	FR04	\N	\N	\N	\N
FDBK36	AP36	PAT30	THR26	2026-04-14 07:00:00+00	\N	pending	\N	FR05	\N	\N	\N	\N
FDBK37	AP37	PAT31	THR27	2026-04-15 07:30:00+00	\N	pending	\N	FR06	\N	\N	\N	\N
FDBK38	AP38	PAT32	THR28	2026-04-16 09:00:00+00	\N	pending	\N	FR07	\N	\N	\N	\N
FDBK39	AP39	PAT33	THR29	2026-04-17 09:30:00+00	\N	pending	\N	FR08	\N	\N	\N	\N
fb-ap837257549	AP837257549	PAT263914850	THR01	2026-03-20 03:40:00+00	\N	pending	\N	FR01	\N	\N	\N	\N
FDBK40	AP40	PAT34	THR30	2026-04-18 11:00:00+00	\N	pending	\N	FR09	\N	\N	\N	\N
FDBK41	AP41	PAT35	THR31	2026-04-19 11:30:00+00	\N	pending	\N	FR10	\N	\N	\N	\N
FDBK42	AP42	PAT36	THR32	2026-04-20 04:00:00+00	\N	pending	\N	FR11	\N	\N	\N	\N
FDBK43	AP43	PAT37	THR33	2026-04-21 04:30:00+00	\N	pending	\N	FR12	\N	\N	\N	\N
FDBK44	AP44	PAT38	THR34	2026-04-22 06:00:00+00	\N	pending	\N	FR13	\N	\N	\N	\N
FDBK45	AP45	PAT39	THR35	2026-04-23 06:30:00+00	\N	pending	\N	FR14	\N	\N	\N	\N
FDBK46	AP46	PAT40	THR36	2026-04-24 08:00:00+00	\N	pending	\N	FR15	\N	\N	\N	\N
FDBK47	AP47	PAT41	THR37	2026-04-25 08:30:00+00	\N	pending	\N	FR16	\N	\N	\N	\N
FDBK48	AP48	PAT42	THR38	2026-04-26 10:00:00+00	\N	pending	\N	FR17	\N	\N	\N	\N
FDBK49	AP49	PAT43	THR39	2026-04-27 10:30:00+00	\N	pending	\N	FR18	\N	\N	\N	\N
FDBK50	AP50	PAT44	THR40	2026-04-28 12:00:00+00	\N	pending	\N	FR19	\N	\N	\N	\N
FDBK51	AP51	PAT45	THR41	2026-05-01 03:30:00+00	\N	pending	\N	FR20	\N	\N	\N	\N
FDBK52	AP52	PAT46	THR42	2026-05-02 05:00:00+00	\N	pending	\N	FR21	\N	\N	\N	\N
FDBK53	AP53	PAT47	THR43	2026-05-03 05:30:00+00	\N	pending	\N	FR22	\N	\N	\N	\N
FDBK54	AP54	PAT48	THR44	2026-05-04 07:00:00+00	\N	pending	\N	FR23	\N	\N	\N	\N
FDBK03	AP03	PAT03	THR01	2026-02-22 06:15:00+00	\N	pending	\N	FR03	\N	\N	\N	\N
FDBK14	AP14	PAT03	THR01	2026-03-19 06:00:00+00	\N	pending	\N	FR03	\N	\N	\N	\N
fb-ap837257548	AP837257548	PAT01	THR01	2026-03-21 03:25:00+00	\N	pending	\N	FR01	\N	\N	\N	\N
fb-ap837257565	AP837257565	PAT26	THR01	2026-03-21 07:05:00+00	\N	pending	\N	FR01	\N	\N	\N	\N
fb-ap837257564	AP837257564	PAT26	THR01	2026-03-21 06:49:00+00	\N	pending	\N	FR01	\N	\N	\N	\N
fb-ap837257563	AP837257563	PAT26	THR01	2026-03-21 06:29:00+00	\N	pending	\N	FR01	\N	\N	\N	\N
fb-ap837257568	AP837257568	PAT26	THR01	2026-03-20 07:45:00+00	\N	pending	\N	FR01	\N	\N	\N	\N
fb-ap837257569	AP837257569	PAT26	THR01	2026-03-21 07:45:00+00	\N	pending	\N	FR01	\N	\N	\N	\N
fb-ap837257567	AP837257567	PAT26	THR01	2026-03-14 07:41:00+00	\N	pending	\N	FR01	\N	\N	\N	\N
fb-ap837257546	AP837257546	PAT263914849	THR01	2026-03-21 03:15:00+00	\N	pending	\N	FR01	\N	\N	\N	\N
fb-ap837257572	AP837257572	PAT263914851	THR01	2026-03-21 11:50:00+00	4	completed	{"final_rating": 4, "Q1_stress_after": 5, "Q3_rested_score": 7, "Q1_stress_before": 7, "Q4_therapist_note": "good", "Q2_circulation_improvement": "Moderate"}	FR01	\N	2026-03-22 03:56:23.494+00	\N	{"final_rating": 4, "Q1_stress_after": 5, "Q3_rested_score": 7, "Q1_stress_before": 7, "Q4_therapist_note": "good", "Q2_circulation_improvement": "Moderate"}
fb-ap837257571	AP837257571	PAT26	THR01	2026-03-21 12:05:00+00	4	completed	{"final_rating": 4, "Q1_stress_after": 3, "Q3_rested_score": 7, "Q1_stress_before": 7, "Q4_therapist_note": "good", "Q2_circulation_improvement": "Moderate"}	FR01	\N	2026-03-22 03:49:36.306+00	\N	{"final_rating": 4, "Q1_stress_after": 3, "Q3_rested_score": 7, "Q1_stress_before": 7, "Q4_therapist_note": "good", "Q2_circulation_improvement": "Moderate"}
FDBK09	AP09	PAT01	THR01	2026-03-08 04:00:00+00	4	completed	{"final_rating": 4, "Q1_stress_after": 5, "Q3_rested_score": 5, "Q1_stress_before": 5, "Q4_therapist_note": "", "Q2_circulation_improvement": ""}	FR01	\N	2026-03-22 05:19:23.344+00	\N	{"final_rating": 4, "Q1_stress_after": 5, "Q3_rested_score": 5, "Q1_stress_before": 5, "Q4_therapist_note": "", "Q2_circulation_improvement": ""}
fb-ap837257550	AP837257550	PAT263914851	THR01	2026-03-21 04:05:00+00	1	completed	\N	FR01	\N	2026-03-21 04:57:27.406+00	\N	\N
fb-ap837257573	AP837257573	PAT26	THR01	2026-03-21 12:48:00+00	3	completed	\N	FR01	\N	2026-03-21 17:02:27.567+00	\N	\N
fb-ap837257551	AP837257551	PAT26	THR01	2026-03-21 04:50:00+00	\N	pending	\N	FR01	in-ap837257551	\N	\N	\N
fb-ap837257566-4915	AP837257566	PAT26	THR01	2026-03-20 07:40:00+00	4	completed	\N	FR01	\N	2026-03-22 04:07:01.028+00	\N	\N
fb-ap837257570	AP837257570	PAT26	THR01	2026-03-21 11:50:00+00	5	completed	{"final_rating": 5, "Q1_stress_after": 5, "Q3_rested_score": 10, "Q1_stress_before": 7, "Q4_therapist_note": "good", "Q2_circulation_improvement": "High"}	FR01	\N	2026-03-22 04:07:21.52+00	\N	{"final_rating": 5, "Q1_stress_after": 5, "Q3_rested_score": 10, "Q1_stress_before": 7, "Q4_therapist_note": "good", "Q2_circulation_improvement": "High"}
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, title, message, "time", is_read) FROM stdin;
NTF01	Feedback Pending	12 completed sessions are waiting for post-care feedback submission.	2m ago	f
NTF02	Overdue Invoice Alert	Invoice INV21 is overdue and requires payment follow-up.	8m ago	f
NTF03	Appointment Rescheduled	AP33 has been moved to 04:30 PM due to therapist availability.	15m ago	f
NTF04	Therapist Added	A new therapist profile THR45 has been created successfully.	1h ago	f
NTF05	New Franchise Entry	A new franchise location was added to the Chennai region.	3h ago	t
NTF06	Billing Summary Ready	Today’s billing summary has been generated and is ready to review.	5h ago	t
NTF07	AI Insight Updated	Wellness trend insight changed in the latest analytics refresh.	1d ago	t
\.


--
-- PostgreSQL database dump complete
--

\unrestrict pyos7729BzpPHJci3fgPmbViv3cDYscppRWVjc8ygF0ZXwfJMoeu7gXd2W7SK2X

