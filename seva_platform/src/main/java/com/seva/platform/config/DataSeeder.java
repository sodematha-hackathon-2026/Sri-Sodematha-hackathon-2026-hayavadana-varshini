package com.seva.platform.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.seva.platform.model.History;
import com.seva.platform.model.Parampara;
import com.seva.platform.model.News;
import com.seva.platform.model.GalleryItem;
import com.seva.platform.model.Seva;
import com.seva.platform.model.Branch;
import com.seva.platform.model.Bhootarajaru;
import com.seva.platform.repository.HistoryRepository;
import com.seva.platform.repository.ParamparaRepository;
import com.seva.platform.repository.NewsRepository;
import com.seva.platform.repository.GalleryItemRepository;
import com.seva.platform.repository.SevaRepository;
import com.seva.platform.repository.BhootarajaruRepository;
import com.seva.platform.repository.UserRepository;
import com.seva.platform.model.User;
import com.seva.platform.model.Institution;
import com.seva.platform.model.LiteraryWork;
import com.seva.platform.model.Miracle;
import com.seva.platform.model.RenovationUpdate;
import com.seva.platform.model.PoojaTiming;
import com.seva.platform.model.DailyWorship;
import com.seva.platform.repository.InstitutionRepository;
import com.seva.platform.repository.LiteraryWorkRepository;
import com.seva.platform.repository.MiracleRepository;
import com.seva.platform.repository.RenovationUpdateRepository;
import com.seva.platform.repository.PoojaTimingRepository;
import com.seva.platform.repository.DailyWorshipRepository;
import com.seva.platform.repository.VideoRepository;
import com.seva.platform.repository.AppConfigRepository;
import com.seva.platform.model.Video;
import com.seva.platform.model.AppConfig;
import com.seva.platform.model.QuizQuestion;
import com.seva.platform.repository.QuizQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Component
public class DataSeeder implements CommandLineRunner {

        @Autowired
        private HistoryRepository historyRepository;

        @Autowired
        private ParamparaRepository paramparaRepository;

        @Autowired
        private NewsRepository newsRepository;

        @Autowired
        private GalleryItemRepository galleryItemRepository;

        @Autowired
        private SevaRepository sevaRepository;

        @Autowired
        private BhootarajaruRepository bhootarajaruRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private InstitutionRepository institutionRepository;

        @Autowired
        private LiteraryWorkRepository literaryWorkRepository;

        @Autowired
        private MiracleRepository miracleRepository;

        @Autowired
        private RenovationUpdateRepository renovationUpdateRepository;

        @Autowired
        private PoojaTimingRepository poojaTimingRepository;

        @Autowired
        private DailyWorshipRepository dailyWorshipRepository;
        @Autowired
        private VideoRepository videoRepository;
        @Autowired
        private AppConfigRepository appConfigRepository;

        @Autowired
        private QuizQuestionRepository quizQuestionRepository;

        @Autowired
        private ObjectMapper objectMapper;

        @Override
        public void run(String... args) throws Exception {
                seedUsers();
                seedHistory();
                seedParampara();
                seedNews();
                seedGallery();
                seedSevas();
                seedBhootarajaru();
                seedInstitutions();
                seedLiteraryWorks();
                seedMiracles();
                seedRenovationUpdates();
                seedPoojaTimings();
                seedDailyWorship();
                seedVideos();
                seedAppConfigs();
                seedBranches();
                seedQuizQuestions();
        }

        @Autowired
        private com.seva.platform.repository.BranchRepository branchRepository;

        private void seedBranches() {
                if (branchRepository.count() == 0) {
                        Branch b1 = new Branch();
                        b1.setName("Sode Moola Matha");
                        b1.setNameKa("ಸೋದೆ ಮೂಲ ಮಠ");
                        b1.setLocation("Sode, Sirsi, Karnataka");
                        b1.setLocationKa("ಸೋದೆ, ಶಿರಸಿ, ಕರ್ನಾಟಕ");
                        b1.setContact("08384-230000");
                        b1.setEmail("info@sodematha.in");
                        b1.setMapUrl("https://maps.app.goo.gl/sode");
                        branchRepository.save(b1);

                        Branch b2 = new Branch();
                        b2.setName("Udupi Branch");
                        b2.setNameKa("ಉಡುಪಿ ಶಾಖೆ");
                        b2.setLocation("Car Street, Udupi");
                        b2.setLocationKa("ರಥಬೀದಿ, ಉಡುಪಿ");
                        b2.setContact("0820-2520000");
                        branchRepository.save(b2);

                        Branch b3 = new Branch();
                        b3.setName("Bangalore Branch");
                        b3.setNameKa("ಬೆಂಗಳೂರು ಶಾಖೆ");
                        b3.setLocation("Basavanagudi, Bangalore");
                        b3.setLocationKa("ಬಸವನಗುಡಿ, ಬೆಂಗಳೂರು");
                        b3.setContact("080-22222222");
                        branchRepository.save(b3);

                        System.out.println("Seeded Branches.");
                }
        }

        private void seedHistory() {
                if (historyRepository.count() == 0) {
                        History history = new History();
                        history.setContentEn(
                                        "The lives of human beings are generally routine in nature, during most part of their life span, without much change in their daily work. It is therefore natural for people to aspire and try for happiness, peace and all possible worldly comforts during their life time.\n\n"
                                                        +
                                                        "They get attracted by and inclined towards objects of enjoyment. But like day and night, there also exist sorrow, pain, fear, uncertainties, difficulties etc, which affect everybody at one time or other, with variable degrees. They cannot be avoided completely by anybody. These negative aspects cause mental disturbance and affect the peace of mind. The people struggle for solutions, sometime without desired results. Then the belief in God, Who is considered to be omnipresent, omniscient and omnipotent assumes greater importance.\n\n"
                                                        +
                                                        "Craving for solace, solutions and peace, the people seek the blessing advice of learned scholars and sages. In bygone days, the saint scholars used to live in the secluded places like Ashrama, temple, Matha and others. With the power of austerity, they tried their best to help and rescue the mankind from mundane worries and sufferings. They alarmed the world about the evil results of deep involvement in worldly pleasures and enjoyment. They cautioned about righteous and unrighteous paths and urged to follow righteous path for the benefit in this life and the life hereafter. They used to preach the essence of sacred lores – Veda, Upanishads and others and showed the noble path of worship of the Lord and other deities with pure devotion. Thus, these centres became the abodes of blessing solace to grief stricken beings.\n\n"
                                                        +
                                                        "Later on, these centres were replaced by Mathas. Mathas were the religious centres headed by a Sanyasin with learned scholars and learning pupils. Belonging to one or other cult, Mathas have been playing an important role in continuing the teaching-learning process of sacred lores and preserving the culture and heritage. The saint scholars of theistic and atheistic schools established some Mathas to propagate the doctrines of their schools and promote the cultured tradition.\n\n"
                                                        +
                                                        "### Jagadguru Sri ManMadhwacharya\n" +
                                                        "Among theistic schools, Sri Madhvacharya occupies key position of repute with regard. The greatness of Sri Madhvacharya is well glorified in the Sumadhvavijaya of Narayana Pandit. His adorable glory is also narrated distinctly in Madhvavilasa, Sampradaya Paddhati, Vayustuti and others. Others include various Stotras, Padas, Suladis etc. All this narrative exposition owes the original source in Vedic literature especially in Puyamana and Pavamana Suktas. According to the prime evidence, seen in this authority, Sri Madhvacharya is held as the third incarnation of god Vayu. Born of pious couple Madhyagehabhat and Vedavati at holy place Pajaka in the present Udupi district of Karnataka, Sri Madhvacharya took Samnyasashrama from Sri Achyutaprekshatirtha. He then became the successor of the pontificial lineage, started from Hamsa formed Supreme Lord. He did many miracles in his childhood and youth days. He was the first to go to Urdhvabadari and fortunate to have the holy Darshana of Lord Vedavyasa and Narayana. Receiving choicest blessings from them, Sri Madhvacharya wrote 37 works and dictated others which have been well known as 'Sarvamula'. Sri Madhvacharya , being visible, is present in Urdhvabadari and invisibly present at Udupi and elsewhere. It is because of his gracious divine presence in all pontiffs of different lineages (Paramparas) and other saint scholars, they have become mystic champions and leading propagators of the Siddhanta.\n\n"
                                                        +
                                                        "### Sri Vadirajatirtharu\n" +
                                                        "Sri Vadiraja was a great saint philosopher, the most facile writer in the Dvaita system. He was a gifted poet, a great mystic, a noted Haridasa and the like. Sri Vadiraja also deserves to be accredited as one of the great, authentic and noted facile writers. The style, the line of approach, the vast reference, the analytical explanation etc, seen in the works of Sri Vadiraja place him next to Sri Madhvacharya.\n\n"
                                                        +
                                                        "Sri Vadirajatirtha happened to be the ever luminous crest jewel of the succession of Sri Vishnutirtha. Sri Vadiraja was born on Magha Shukla Dwadashi of Sharvari Samvatsara (1481 A.D) by the grace of Vagishatirtha, the nineteenth in the hierarchy of Vishnutirtha. His parents were Sri Ramacharya and Gouri. His birth name was spelled as Varaha as he was born with the blessings of Lord Varaha, favourite and presiding deity (idol) given by Sri Madhvacharya to Vishnutirtha. As destined by destiny,Sri Vadiraja's birth took place outside the residence. The essential Samskaras such as Jatakarma, Namakarana etc. were performed on time. Varaha's Upanayanam was celebrated at the age of five and he was ordained the Samnyasashrama soon after the completion of 7 years by Vagishatirtha. He was named as Vadirajatirtha. The Ashramanama is significant as it conveys the rich proficiency and pre-eminence in delivering the true import of lores in skilful manner with fitness evoking surprise. It also means that Sri Vadiraja is an undaunted debater like mighty lion to the elephants of opponents.Sri Vadiraja studied a few primary works under Vidyanidhi, (a senior disciple of Vagishatirtha) and after his demise, he continued his studies under his Guru Vagishatirtha.");

                        history.setContentKa(
                                        "ಮಾನವ ಜೀವನವು ಸಾಮಾನ್ಯವಾಗಿ ದಿನನಿತ್ಯದ ಕೆಲಸಗಳಲ್ಲಿಯೇ ಕಳೆದುಹೋಗುತ್ತದೆ. ಆದರೆ ಶಾಂತಿ, ನೆಮ್ಮದಿ ಮತ್ತು ಸುಖಕ್ಕಾಗಿ ಜನರು ಹಂಬಲಿಸುವುದು ಸಹಜ. ಹಿಂದಿನ ಕಾಲದಲ್ಲಿ ಋಷಿಮುನಿಗಳು ಆಶ್ರಮ, ದೇವಾಲಯ ಮತ್ತು ಮಠಗಳಲ್ಲಿ ನೆಲೆಸಿ ಲೋಕಕಲ್ಯಾಣಕ್ಕಾಗಿ ತಪಸ್ಸು ಮಾಡುತ್ತಿದ್ದರು.\n\n"
                                                        +
                                                        "ನಂತರ ಈ ಕೇಂದ್ರಗಳು ಮಠಗಳಾಗಿ ಮಾರ್ಪಟ್ಟವು. ಮಠಗಳು ಧಾರ್ಮಿಕ ಕೇಂದ್ರಗಳಾಗಿ ಸನ್ಯಾಸಿಗಳ ನೇತೃತ್ವದಲ್ಲಿ ವಿದ್ವಾಂಸರು ಮತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳನ್ನು ಒಳಗೊಂಡಿದ್ದವು. ಇವು ಸಂಸ್ಕೃತಿ ಮತ್ತು ಪರಂಪರೆಯನ್ನು ಉಳಿಸುವಲ್ಲಿ ಪ್ರಮುಖ ಪಾತ್ರ ವಹಿಸಿವೆ.\n\n"
                                                        +
                                                        "### ಜಗದ್ಗುರು ಶ್ರೀ ಮಧ್ವಾಚಾರ್ಯರು\n" +
                                                        "ಆಸ್ತಿಕ ಪಂಥಗಳಲ್ಲಿ ಶ್ರೀ ಮಧ್ವಾಚಾರ್ಯರು ಅಗ್ರಗಣ್ಯರು. ನಾರಾಯಣ ಪಂಡಿತಾಚಾರ್ಯರ ಸುಮಧ್ವವಿಜಯದಲ್ಲಿ ಇವರ ಮಹಿಮೆಯನ್ನು ವರ್ಣಿಸಲಾಗಿದೆ. ಉಡುಪಿ ಜಿಲ್ಲೆಯ ಪಾಜಕ ಕ್ಷೇತ್ರದಲ್ಲಿ ಮಧ್ಯಗೇಹ ಭಟ್ಟರು ಮತ್ತು ವೇದಾವತಿ ದಂಪತಿಗಳಿಗೆ ಜನಿಸಿದ ಇವರು ಶ್ರೀ ಅಚ್ಯುತಪ್ರೇಕ್ಷತೀರ್ಥರಿಂದ ಸನ್ಯಾಸಾಶ್ರಮ ಸ್ವೀಕರಿಸಿದರು. ಬದರಿಕಾಶ್ರಮಕ್ಕೆ ಹೋಗಿ ಶ್ರೀ ವೇದವ್ಯಾಸದೇವರ ದರ್ಶನ ಪಡೆದರು. ಸರ್ವಮೂಲ ಗ್ರಂಥಗಳನ್ನು ರಚಿಸಿದರು. ಶ್ರೀ ಮಧ್ವಾಚಾರ್ಯರು ದ್ವೈತ ಸಿದ್ಧಾಂತವನ್ನು ಪ್ರತಿಪಾದಿಸಿದರು. ಜೀವಾತ್ಮ ಮತ್ತು ಪರಮಾತ್ಮ ಬೇರೆ ಬೇರೆ ಎಂದು ಸಾರಿದರು.\n\n"
                                                        +
                                                        "### ಶ್ರೀ ವಾದಿರಾಜತೀರ್ಥರು\n" +
                                                        "ಶ್ರೀ ವಾದಿರಾಜರು ದ್ವೈತ ಸಿದ್ಧಾಂತದ ಶ್ರೇಷ್ಠ ಸಂತರು, ಕವಿಗಳು ಮತ್ತು ತತ್ವಜ್ಞಾನಿಗಳು. ಇವರು ಸೋದೆ ಮಠದ ಪರಂಪರೆಯಲ್ಲಿ ಅದ್ವಿತೀಯರು. ಕುಂದಾಪುರದ ಹತ್ತಿರದ ಹೂವಿನಕೆರೆಯಲ್ಲಿ ಜನಿಸಿದ ಇವರು ಶ್ರೀ ವಾಗೀಶತೀರ್ಥರಿಂದ ಸನ್ಯಾಸಾಶ್ರಮ ಪಡೆದರು. ಇವರು ತೀರ್ಥಪ್ರಬಂಧ, ರುಕ್ಮಿಣೀಶವಿಜಯ, ಯುಕ್ತಿಮಲ್ಲಿಕಾ ಮುಂತಾದ ಅನೇಕ ಗ್ರಂಥಗಳನ್ನು ರಚಿಸಿದರು. ಉಡುಪಿಯಲ್ಲಿ ಪರ್ಯಾಯದ ಅವಧಿಯನ್ನು ಎರಡು ವರ್ಷಗಳಿಗೆ ಬದಲಾಯಿಸಿದ ಕೀರ್ತಿ ಇವರಿಗೆ ಸಲ್ಲುತ್ತದೆ. ಸೋದೆ ಕ್ಷೇತ್ರದಲ್ಲಿ ತ್ರಿವಿಕ್ರಮ ದೇವರನ್ನು ಪ್ರತಿಷ್ಠಾಪಿಸಿದರು ಮತ್ತು ಅಲ್ಲಿಯೇ ಸಶರೀರರಾಗಿ ವೃಂದಾವನಸ್ಥರಾದರು. ಇವರ ತಪಃಶಕ್ತಿ ಮತ್ತು ಪಾಂಡಿತ್ಯ ಅಸಾಧಾರಣವಾದುದು. ಭಕ್ತರ ಕಷ್ಟಗಳನ್ನು ಪರಿಹರಿಸುವಲ್ಲಿ ಇವರು ಸದಾ ಸಿದ್ಧಹಸ್ತರು. ಹಯಗ್ರೀವ ದೇವರು ಇವರ ಆರಾಧ್ಯ ದೈವ. 120 ವರ್ಷಗಳ ಕಾಲ ದೀರ್ಘಾಯುಷ್ಯವನ್ನು ಪಡೆದ ಇವರು ಸೋದೆಯಲ್ಲಿ ಸಶರೀರ ವೃಂದಾವನಸ್ಥರಾದರು.");

                        historyRepository.save(history);
                        System.out.println("Seeded History data.");
                }
        }

        @SuppressWarnings("unchecked")
        private void seedParampara() {
                if (paramparaRepository.count() == 0) {
                        try {
                                InputStream inputStream = new ClassPathResource("parampara.json").getInputStream();
                                List<Map<String, Object>> items = objectMapper.readValue(inputStream,
                                                new TypeReference<List<Map<String, Object>>>() {
                                                });

                                for (Map<String, Object> item : items) {
                                        Parampara parampara = new Parampara();
                                        String name = (String) item.get("name");
                                        List<String> descList = (List<String>) item.get("description");
                                        String description = descList != null ? String.join("\n\n", descList) : "";
                                        String image = (String) item.get("image");

                                        // Basic Parsing
                                        parampara.setName(name);
                                        parampara.setDescriptionEn(description);
                                        parampara.setDescriptionKa(description); // Fallback
                                        if (image != null && !image.isEmpty()) {
                                                parampara.setPhotoUrl(
                                                                "https://www.sodematha.in/images/swamijis/" + image);
                                        }

                                        // Try to infer period
                                        if (name.contains("(")) {
                                                String period = name.substring(name.indexOf("(") + 1,
                                                                name.indexOf(")"));
                                                parampara.setPeriod(period);
                                                parampara.setName(name.substring(0, name.indexOf("(")).trim()
                                                                .replace(" -", ""));
                                        } else if (description.contains("Pontiff")) {
                                                // Simple heuristic for period
                                        }

                                        // Specific Logic for well known ones
                                        if (name.contains("Vadiraja")) {
                                                parampara.setPeriod("1480 - 1600");
                                                parampara.setVrindavanaLocation("Sode, Sirsi, Karnataka");
                                                parampara.setVrindavanaUrl("https://maps.app.goo.gl/sode");
                                        }

                                        // Download and store image
                                        if (image != null && !image.isEmpty()) {
                                                String imgUrl = "https://www.sodematha.in/images/swamijis/" + image;
                                                try {
                                                        byte[] imageBytes = downloadImage(imgUrl);
                                                        parampara.setImage(imageBytes);
                                                } catch (Exception e) {
                                                        System.out.println("Failed to download image for " + name + ": "
                                                                        + e.getMessage());
                                                }
                                        }

                                        paramparaRepository.save(parampara);
                                }
                                System.out.println("Seeded Parampara data: " + items.size() + " entries.");
                        } catch (Exception e) {
                                System.out.println("Failed to seed Parampara: " + e.getMessage());
                                e.printStackTrace();
                        }
                }
        }

        private void seedNews() {
                if (newsRepository.count() == 0) {
                        News n1 = new News();
                        n1.setTitle("Sri Madhvacharya Birth Anniversary Celebrations");
                        n1.setTitleKa("ಶ್ರೀ ಮಧ್ವಾಚಾರ್ಯರ ಜಯಂತಿ ಮಹೋತ್ಸವ");
                        n1.setContent(
                                        "Grand celebrations at Pajaka Kshetra. Special poojas and cultural events scheduled for the upcoming week.");
                        n1.setContentKa(
                                        "ಪಾಜಕ ಕ್ಷೇತ್ರದಲ್ಲಿ ಅದ್ಧೂರಿ ಆಚರಣೆಗಳು. ಮುಂಬರುವ ವಾರದಲ್ಲಿ ವಿಶೇಷ ಪೂಜೆ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳು.");
                        n1.setFlashUpdate(true);
                        newsRepository.save(n1);

                        News n2 = new News();
                        n2.setTitle("Upcoming Paryaya Festival Information");
                        n2.setTitleKa("ಮುಂಬರುವ ಪರ್ಯಾಯ ಮಹೋತ್ಸವದ ಮಾಹಿತಿ");
                        n2.setContent(
                                        "Important updates for devotees planning to visit Udupi during the upcoming Paryaya festival. Accommodation bookings are now open.");
                        n2.setContentKa(
                                        "ಉಡುಪಿಯ ಪರ್ಯಾಯ ಮಹೋತ್ಸವಕ್ಕೆ ಆಗಮಿಸುವ ಭಕ್ತರಿಗೆ ಪ್ರಮುಖ ಮಾಹಿತಿ. ವಸತಿ ಬುಕ್ಕಿಂಗ್ ಈಗ ತೆರೆಯಲಾಗಿದೆ.");
                        n2.setFlashUpdate(false);
                        newsRepository.save(n2);

                        System.out.println("Seeded News data.");
                }
        }

        private void seedGallery() {
                if (galleryItemRepository.count() == 0) {
                        GalleryItem g1 = new GalleryItem();
                        g1.setTitle("Sri Madhvacharya Idol");
                        g1.setCategory("Deities");
                        g1.setImageUrl("https://www.udupiparyaya.com/images/madhva.jpg");
                        galleryItemRepository.save(g1);

                        GalleryItem g2 = new GalleryItem();
                        g2.setTitle("Sode Matha Entrance");
                        g2.setCategory("Historical");
                        g2.setImageUrl("https://www.sodematha.in/images/header/sode_matha.jpg");
                        galleryItemRepository.save(g2);

                        GalleryItem g3 = new GalleryItem();
                        g3.setTitle("Annual Rathotsava");
                        g3.setCategory("Events");
                        g3.setImageUrl("https://www.sodematha.in/images/rathotsava.jpg");
                        galleryItemRepository.save(g3);

                        System.out.println("Seeded Gallery data.");
                }
        }

        private void seedSevas() {
                if (sevaRepository.count() == 0) {
                        Seva s1 = new Seva();
                        s1.setName("Panchamrutha Abhisheka");
                        s1.setNameKa("ಪಂಚಾಮೃತ ಅಭಿಷೇಕ");
                        s1.setDescription("Performed daily at 8:00 AM.");
                        s1.setDescriptionKa("ದಿನನಿತ್ಯ ಬೆಳಿಗ್ಗೆ 8:00 ಗಂಟೆಗೆ.");
                        s1.setAmount(new BigDecimal("500.00"));
                        s1.setActive(true);
                        s1.setLocation(Seva.Location.SODE);
                        s1.setType(Seva.SevaType.POOJA);
                        sevaRepository.save(s1);

                        Seva s2 = new Seva();
                        s2.setName("Annadana Seva");
                        s2.setNameKa("ಅನ್ನದಾನ ಸೇವೆ");
                        s2.setDescription("Contribution towards mid-day meals.");
                        s2.setDescriptionKa("ಮಧ್ಯಾಹ್ನದ ಊಟಕ್ಕೆ ದೇಣಿಗೆ.");
                        s2.setAmount(new BigDecimal("1000.00"));
                        s2.setActive(true);
                        s2.setLocation(Seva.Location.SODE);
                        s2.setType(Seva.SevaType.ANNADANA);
                        sevaRepository.save(s2);

                        // Goseva Sevas (Source: Kamadhenu Trust)
                        createSeva("1 Month Goshala Seva", "1 ತಿಂಗಳ ಗೋಶಾಲೆಯ ಸೇವೆ",
                                        "Complete maintenance of Goshala for 1 month.",
                                        "ಒಂದು ತಿಂಗಳ ಗೋಶಾಲೆಯ ಸಂಪೂರ್ಣ ನಿರ್ವಹಣೆ.", new BigDecimal("300000.00"),
                                        Seva.SevaType.GOSHALA);
                        createSeva("1 Month Cattle Feed Seva", "1 ತಿಂಗಳ ಹಿಂಡಿಯ ಸೇವೆ", "Cattle feed for 1 month.",
                                        "ಒಂದು ತಿಂಗಳ ಹಿಂಡಿಯ ಸೇವೆ.", new BigDecimal("100000.00"), Seva.SevaType.GOSHALA);
                        createSeva("1 Month Fodder Seva", "1 ತಿಂಗಳ ಹುಲ್ಲಿನ ಸೇವೆ", "Green/Dry fodder for 1 month.",
                                        "ಒಂದು ತಿಂಗಳ ಹುಲ್ಲಿನ ಸೇವೆ.", new BigDecimal("50000.00"), Seva.SevaType.GOSHALA);
                        createSeva("1 Day Goshala Seva", "1 ದಿನದ ಗೋಶಾಲೆಯ ಸೇವೆ", "Maintenance for 1 day.",
                                        "ಒಂದು ದಿನದ ಗೋಶಾಲೆಯ ಸೇವೆ.",
                                        new BigDecimal("10000.00"), Seva.SevaType.GOSHALA);
                        createSeva("1 Day Gograsa Seva", "1 ದಿನದ ಗೋಗ್ರಾಸ ಸೇವೆ", "Food for cows for 1 day.",
                                        "ಒಂದು ದಿನದ ಗೋಗ್ರಾಸ ಸೇವೆ.", new BigDecimal("500.00"), Seva.SevaType.GOSHALA);

                        // New Sevas from sodematha.in
                        createSeva("Dhanurmasa Pooja", "ಧನುರ್ಮಾಸ ಪೂಜೆ", "Special pooja performed during Dhanurmasa.",
                                        "ಧನುರ್ಮಾಸದ ವಿಶೇಷ ಪೂಜೆ.", new BigDecimal("200.00"), Seva.SevaType.POOJA);
                        createSeva("One day Sampoorna Seva", "ಒಂದು ದಿನದ ಸಂಪೂರ್ಣ ಸೇವೆ",
                                        "Includes all sevas for one day with Annadana.",
                                        "ಒಂದು ದಿನದ ಸಂಪೂರ್ಣ ಸೇವೆ ಮತ್ತು ಅನ್ನದಾನ ಸೇರಿ.", new BigDecimal("5001.00"),
                                        Seva.SevaType.OTHER);
                        createSeva("Maha Sarvaseva", "ಮಹಾ ಸರ್ವಸೇವಾ", "Includes special night Bhootharaja Pooja.",
                                        "ವಿಶೇಷ ರಾತ್ರಿ ಭೂತರಾಜರ ಪೂಜೆ ಸೇರಿ.", new BigDecimal("1500.00"),
                                        Seva.SevaType.POOJA);
                        createSeva("Tulasi Archane", "ತುಳಸಿ ಅರ್ಚನೆ", "For Sri Trivikrama Devaru.",
                                        "ಶ್ರೀ ತ್ರಿವಿಕ್ರಮ ದೇವರಿಗೆ ತುಳಸಿ ಅರ್ಚನೆ.", new BigDecimal("25.00"),
                                        Seva.SevaType.POOJA);
                        createSeva("Pratyaksha Godana - Uttama", "ಪ್ರತ್ಯಕ್ಷ ಗೋದಾನ", "Excellent cow donation.",
                                        "ಪ್ರತ್ಯಕ್ಷ ಗೋದಾನ - ಉತ್ತಮ.", new BigDecimal("25000.00"), Seva.SevaType.GOSHALA);
                        createSeva("Pratrukta Godana - Madhyama", "ಪ್ರತೃಕ್ತ ಗೋದಾನ", "Medium cow donation.",
                                        "ಪ್ರತೃಕ್ತ ಗೋದಾನ - ಮಧ್ಯಮ.", new BigDecimal("15000.00"), Seva.SevaType.GOSHALA);
                        createSeva("Godana", "ಗೋದಾನ", "Excluding Dakshine.",
                                        "ಗೋದಾನ (ದಕ್ಷಿಣೆ ಹೊರತು).", new BigDecimal("3000.00"), Seva.SevaType.GOSHALA);
                        createSeva("Nandadeepa - 1 Year", "ನಂದಾದೀಪ - 1 ವರ್ಷ", "Lighting lamp for 1 year.",
                                        "ಒಂದು ವರ್ಷದ ನಂದಾದೀಪ.", new BigDecimal("1200.00"), Seva.SevaType.POOJA);
                        createSeva("Nandadeepa - 1 Month", "ನಂದಾದೀಪ - 1 ತಿಂಗಳು", "Lighting lamp for 1 month.",
                                        "ಒಂದು ತಿಂಗಳ ನಂದಾದೀಪ.", new BigDecimal("100.00"), Seva.SevaType.POOJA);
                        createSeva("Sri Bhootharaja Visesha Raatri Pooja", "ಶ್ರೀ ಭೂತರಾಜರ ವಿಶೇಷ ರಾತ್ರಿ ಪೂಜಾ",
                                        "Special night pooja for Bhootharajaru.",
                                        "ಶ್ರೀ ಭೂತರಾಜರ ವಿಶೇಷ ರಾತ್ರಿ ಪೂಜೆ.", new BigDecimal("101.00"),
                                        Seva.SevaType.POOJA);

                        // Alankara Sevas
                        createSeva("Ksheerabhisheka", "ಕ್ಷೀರಾಭಿಷೇಕ", "Abhisheka with milk and decoration.",
                                        "ಹಾಲಿನ ಅಭಿಷೇಕ ಮತ್ತು ಅಲಂಕಾರ.", new BigDecimal("250.00"), Seva.SevaType.ALANKARA);
                        createSeva("Vishesha Alankara Pooja", "ವಿಶೇಷ ಅಲಂಕಾರ ಪೂಜೆ", "Special decorative pooja.",
                                        "ವಿಶೇಷ ಅಲಂಕಾರ ಪೂಜೆ.", new BigDecimal("1000.00"), Seva.SevaType.ALANKARA);

                        System.out.println("Seeded Sevas data.");
                }
        }

        private void createSeva(String name, String nameKa, String desc, String descKa, BigDecimal amount,
                        Seva.SevaType type) {
                Seva s = new Seva();
                s.setName(name);
                s.setNameKa(nameKa);
                s.setDescription(desc);
                s.setDescriptionKa(descKa);
                s.setAmount(amount);
                s.setActive(true);
                s.setLocation(Seva.Location.SODE);
                s.setType(type);
                sevaRepository.save(s);
        }

        private void seedInstitutions() {
                if (institutionRepository.count() == 0) {
                        createInstitution("Shri Madhwa Vadiraja Institute of Technology & Management (SMVITM)",
                                        "Bantakal, Udupi",
                                        "https://www.smvitm.ac.in/", "info@sode-edu.in",
                                        "Engineering Education with Values");
                        createInstitution("Netaji Subhash Chandra Bose Residential School", "Sode, Sirsi",
                                        "https://sode-edu.in/institutions/nscb-residential-school/",
                                        "08384-230000", "Holistic Education");
                        createInstitution("Sri Vishnumurthy Hayavadana Swami English Medium High School", "Innanje",
                                        "https://svhinnanje.com/", "0820-2555555", "Excellence in Schooling");
                        createInstitution("S.V.H. Pre-University College", "Innanje", "https://svhinnanje.com/",
                                        "0820-2555555",
                                        "Pre-University Education");
                        createInstitution("S.V.S. English Medium Primary School", "Innanje", "https://svhinnanje.com/",
                                        "0820-2555555",
                                        "Primary Education");
                        createInstitution("Kadiyali English Medium High School", "Udupi", "https://sode-edu.in/",
                                        "0820-2520000",
                                        "Quality High School Education");
                        createInstitution("Kadiyali Higher Primary School", "Udupi", "https://sode-edu.in/",
                                        "0820-2520000",
                                        "Primary Education");
                        createInstitution("Nethravathi School of Nursing", "Udupi", "https://sode-edu.in/",
                                        "0820-2520000",
                                        "Nursing Education");

                        System.out.println("Seeded Institutions.");
                }
        }

        private void createInstitution(String name, String loc, String web, String contact, String tagline) {
                Institution i = new Institution();
                i.setName(name);
                i.setLocation(loc);
                i.setWebsite(web);
                i.setContact(contact);
                i.setTagline(tagline);
                institutionRepository.save(i);
        }

        private void seedLiteraryWorks() {
                if (literaryWorkRepository.count() == 0) {
                        createLiteraryWork("Yukti Mallika", "ಯುಕ್ತಿ ಮಲ್ಲಿಕಾ", "Philosophy",
                                        "Magnum opus of Sri Vadiraja Teertha. Logical defense of Dvaita Vedanta.",
                                        null);
                        createLiteraryWork("Rukminisha Vijaya", "ರುಕ್ಮಿಣೀಶ ವಿಜಯ", "Mahakavya",
                                        "Great epic poem describing the life of Lord Krishna, specifically focusing on Rukmini Swayamvara.",
                                        null);
                        createLiteraryWork("Tirtha Prabandha", "ತೀರ್ಥ ಪ್ರಬಂಧ", "Travelogue/Stotra",
                                        "Describes the glory of various holy places (Tirthas) visited by Sri Vadiraja Teertha.",
                                        null);
                        createLiteraryWork("Svapna Vrindavanakhyana", "ಸ್ವಪ್ನ ವೃಂದಾವನಾಖ್ಯಾನ", "Mystical",
                                        "A unique work revealed in dreams, containing details about the hierarchy of deities and the Riju Gana.",
                                        null);
                        createLiteraryWork("Haribhakti Sara", "ಹರಿಭಕ್ತಿ ಸಾರ", "Kannada Dasa Sahitya",
                                        "Collection of devotional songs in Kannada emphasizing Bhakti.", null);
                        System.out.println("Seeded Literary Works.");
                }
        }

        private void createLiteraryWork(String title, String titleKa, String cat, String desc, String url) {
                LiteraryWork w = new LiteraryWork();
                w.setTitle(title);
                w.setTitleKa(titleKa);
                w.setCategory(cat);
                w.setDescription(desc);
                w.setUrl(url);
                literaryWorkRepository.save(w);
        }

        private void seedMiracles() {
                if (miracleRepository.count() == 0) {
                        createMiracle("The Moving of the Wall", "ಗೋಡೆ ಸರಿದದ್ದು",
                                        "When Sri Vadiraja Teertha wanted to offer Naivedya to Lord Hayagriva, a wall stood in between. Due to his immense devotion, the wall of the temple cracked open to allow him to offer the food.",
                                        "ಶ್ರೀ ವಾದಿರಾಜರು ಹಯಗ್ರೀವ ದೇವರಿಗೆ ನೈವೇದ್ಯ ಮಾಡಲು ಬಯಸಿದಾಗ, ಅಡ್ಡಲಾಗಿದ್ದ ಗೋಡೆಯು ಅವರ ಭಕ್ತಿಗೆ ಮೆಚ್ಚಿ ಒಡೆದು ದಾರಿ ಮಾಡಿಕೊಟ್ಟಿತು.");
                        createMiracle("Hayagriva Eating Hay", "ಹಯಗ್ರೀವನು ಕಡಲೆ ತಿನ್ನುತ್ತಿದ್ದದ್ದು",
                                        "Sri Vadiraja Teertha used to offer 'Hayagriva' (a sweet dish made of bengal gram) to the Lord daily. The Lord, in the form of a white horse, would appear and eat it from a plate held on the Swamiji's head.",
                                        "ಶ್ರೀ ವಾದಿರಾಜರು ಪ್ರತಿದಿನ ದೇವರಿಗೆ ಹಯಗ್ರೀವ ಪ್ರಸಾದವನ್ನು ಅರ್ಪಿಸುತ್ತಿದ್ದರು. ದೇವರು ಬಿಳಿಯ ಕುದುರೆಯ ರೂಪದಲ್ಲಿ ಬಂದು ಸ್ವಾಮಿಗಳ ತಲೆಯ ಮೇಲಿದ್ದ ತಟ್ಟೆಯಿಂದ ಅದನ್ನು ಭಕ್ಷಿಸುತ್ತಿದ್ದರು.");
                        createMiracle("Reviving the Dead Prince", "ಸತ್ತ ರಾಜಕುಮಾರನ ಬದುಕಿನ",
                                        "While on a tour, Sri Vadiraja Teertha revived a dead prince in Delhi using his spiritual powers, thereby gaining the respect of the Sultan.",
                                        "ದಿಲ್ಲಿಯಲ್ಲಿ ಸಂಚರಿಸುವಾಗ, ಮರಣಹೊಂದಿದ ರಾಜಕುಮಾರನನ್ನು ಶ್ರೀ ವಾದಿರಾಜರು ತಮ್ಮ ತಪಃಶಕ್ತಿಯಿಂದ ಬದುಕಿಸಿದರು. ಇದರಿಂದ ಸುಲ್ತಾನನು ಅವರಿಗೆ ಗೌರವ ನೀಡಿದನು.");
                        System.out.println("Seeded Miracles.");
                }
        }

        private void createMiracle(String t, String tKa, String dEn, String dKa) {
                Miracle m = new Miracle();
                m.setTitle(t);
                m.setTitleKa(tKa);
                m.setDescriptionEn(dEn);
                m.setDescriptionKa(dKa);
                miracleRepository.save(m);
        }

        private void seedRenovationUpdates() {
                if (renovationUpdateRepository.count() == 0) {
                        RenovationUpdate r = new RenovationUpdate();
                        r.setTitle("Sode Matha Revitalization Project");
                        r.setDescription(
                                        "A grand project to renovate the ancient structures of Sode Matha, including the guest house and dining hall. Total estimated cost is ₹30 Crores. We invite all devotees to contribute generously.");
                        r.setTargetAmount(new BigDecimal("300000000"));
                        r.setCollectedAmount(new BigDecimal("15000000"));
                        r.setContributorsCount(520);
                        r.setStatus(RenovationUpdate.Status.ONGOING);
                        renovationUpdateRepository.save(r);
                        System.out.println("Seeded Renovation Updates.");
                }
        }

        private void seedBhootarajaru() {
                if (bhootarajaruRepository.count() == 0) {
                        Bhootarajaru b = new Bhootarajaru();
                        b.setName("Sri Bhootarajaru");
                        b.setDescriptionEn(
                                        "Sri Bhootarajaru is the guardian deity of Sode Matha. He was a dedicated devotee and chief attendant of Sri Vadiraja Teertha Swamiji. He is known for protecting the Matha and its devotees.");
                        b.setDescriptionKa(
                                        "ಶ್ರೀ ಭೂತರಾಜರು ಸೋದೆ ಮಠದ ರಕ್ಷಕ ದೈವಗಳು. ಇವರು ಶ್ರೀ ವಾದಿರಾಜ ತೀರ್ಥ ಸ್ವಾಮಿಗಳ ಪರಮ ಭಕ್ತರು ಮತ್ತು ಮುಖ್ಯ ಸೇವಕರು. ಮಠವನ್ನು ಮತ್ತು ಭಕ್ತರನ್ನು ರಕ್ಷಿಸುವಲ್ಲಿ ಇವರು ಪ್ರಸಿದ್ಧರು.");
                        bhootarajaruRepository.save(b);
                        System.out.println("Seeded Bhootarajaru data.");
                }
        }

        private void seedUsers() {
                if (userRepository.count() == 0) {
                        User admin = new User();
                        admin.setName("Vijay Admin");
                        admin.setMobileNumber("9999999999");
                        admin.setEmail("vijay@example.com");
                        admin.setRole(User.Role.ADMIN);
                        userRepository.save(admin);

                        User user = new User();
                        user.setName("Devotee User");
                        user.setMobileNumber("8888888888");
                        user.setRole(User.Role.USER);
                        userRepository.save(user);

                        System.out.println("Seeded Users.");
                }
        }

        private void seedPoojaTimings() {
                if (poojaTimingRepository.count() == 0) {
                        createPoojaTiming("Shri RamaTrivikrama Temple", "5:00 AM TO 5:30 AM", "MORNING", "EN");
                        createPoojaTiming("Shri RamaTrivikrama Temple", "8:10 AM TO 8:30 AM", "MORNING", "EN");
                        createPoojaTiming("Shri RamaTrivikrama Temple", "6:00 PM TO 6:30 PM", "NIGHT", "EN");

                        createPoojaTiming("Shri Vadirajaru Temple", "5:30 AM TO 6:00 AM", "MORNING", "EN");
                        createPoojaTiming("Shri Vadirajaru Temple", "7:00 AM TO 7:30 AM", "MORNING", "EN");
                        createPoojaTiming("Shri Vadirajaru Temple", "8:30 AM TO 9:00 AM", "MORNING", "EN");
                        createPoojaTiming("Shri Vadirajaru Temple", "6:30 PM TO 7:00 PM", "NIGHT", "EN");

                        createPoojaTiming("Shri Botarajara Ratri Vishesha Pooja", "7:00 PM TO 7:30 PM", "NIGHT", "EN");

                        createPoojaTiming("Anna Prasada", "11:30 AM TO 1:30 PM", "AFTERNOON", "EN");
                        createPoojaTiming("Anna Prasada", "7:30 PM TO 9:00 PM", "NIGHT", "EN");
                }
        }

        private void createPoojaTiming(String temple, String time, String slot, String lang) {
                PoojaTiming pt = new PoojaTiming();
                pt.setTempleName(temple);
                pt.setTiming(time);
                pt.setSlot(slot);
                pt.setLanguage(lang);
                poojaTimingRepository.save(pt);
        }

        private void seedDailyWorship() {
                if (dailyWorshipRepository.count() == 0) {
                        createWorship("Sri Bhuvaraha", "ಶ್ರೀ ಭೂವರಾಹ",
                                        "Sri Madhvacharya blessed this Bhuvaraha icon to Sri Vishnu-tirtha...",
                                        "ಶ್ರೀ ಮಧ್ವಾಚಾರ್ಯರು ಈ ಭೂವರಾಹ ವಿಗ್ರಹವನ್ನು ಶ್ರೀ ಸೋದೆ ವಾದಿರಾಜ ಮಠದ ಸಂಸ್ಥಾಪಕ ಶ್ರೀ ವಿಷ್ಣುತೀರ್ಥರಿಗೆ ನೀಡಿದರು...",
                                        "https://www.sodematha.in/images/bhuvaraha.jpg");

                        createWorship("Sri Hayagriva", "ಶ್ರೀ ಹಯಗ್ರೀವ",
                                        "The icon of Hayagriva form was given by the Lord himself to Sri Vadiraja...",
                                        "ಶ್ರೀ ಹಯಗ್ರೀವ ದೇವರ ವಿಗ್ರಹವು ನೇರವಾಗಿ ಭಗವಂತನಿಂದ ನೀಡಲ್ಪಟ್ಟದ್ದು...",
                                        "https://www.sodematha.in/images/hayagriva.jpg");

                        createWorship("Sri Lakshmi Narasimha", "ಶ್ರೀ ಲಕ್ಷ್ಮೀ ನರಸಿಂಹ",
                                        "Once Sri Vadiraja took out Sri Lakshmi Narasimha icon duly worshipped by Bhimasena...",
                                        "ಶ್ರೀ ವಾದಿರಾಜರು ಕುರುಕ್ಷೇತ್ರದಲ್ಲಿ ಭೀಮಸೇನನಿಂದ ಪೂಜಿಸಲ್ಪಟ್ಟ ಲಕ್ಷ್ಮೀ ನರಸಿಂಹ ವಿಗ್ರಹವನ್ನು ಕಂಡುಕೊಂಡರು...",
                                        "https://www.sodematha.in/images/narasimha.jpg");
                }
        }

        private void createWorship(String name, String nameKa, String descEn, String descKa, String img) {
                DailyWorship dw = new DailyWorship();
                dw.setDeityName(name);
                dw.setDeityNameKa(nameKa);
                dw.setDescriptionEn(descEn);
                dw.setDescriptionKa(descKa);
                dw.setImageUrl(img);
                dailyWorshipRepository.save(dw);
        }

        private void seedVideos() {
                if (videoRepository.count() == 0) {
                        createVideo("Sode Matha Darshan", "ಸೋದೆ ಮಠ ದರ್ಶನ", "Temple",
                                        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                                        "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg");
                        createVideo("Paryaya Festival", "ಪರ್ಯಾಯ ಉತ್ಸವ", "Events",
                                        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                                        "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg");
                        createVideo("Daily Pooja", "ದೈನಂದಿನ ಪೂಜೆ", "Rituals",
                                        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                                        "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg");
                        System.out.println("Seeded Videos.");
                }
        }

        private void createVideo(String t, String tKa, String cat, String url, String thumb) {
                Video v = new Video();
                v.setTitle(t);
                v.setTitleKa(tKa);
                v.setCategory(cat);
                v.setVideoUrl(url);
                v.setThumbnailUrl(thumb);
                videoRepository.save(v);
        }

        private void seedAppConfigs() {
                if (appConfigRepository.count() == 0) {
                        appConfigRepository.save(new AppConfig("section_history", "History Section", true));
                        appConfigRepository.save(new AppConfig("section_sevas", "Sevas Section", true));
                        appConfigRepository.save(new AppConfig("section_gallery", "Gallery Section", true));
                        appConfigRepository.save(new AppConfig("section_rooms", "Room Booking", true));
                        appConfigRepository
                                        .save(new AppConfig("section_institutions", "Educational Institutions", true));
                        appConfigRepository.save(new AppConfig("section_literary_works", "Literary Works", true));
                        appConfigRepository.save(new AppConfig("section_miracles", "Miracles", true));
                        appConfigRepository.save(new AppConfig("section_renovation", "Renovation Project", true));
                        appConfigRepository.save(new AppConfig("section_videos", "Video Gallery", true));
                        appConfigRepository.save(new AppConfig("renovation_goal", "30", true));
                        appConfigRepository.save(new AppConfig("renovation_collected", "15.6", true));
                        appConfigRepository.save(new AppConfig("renovation_contributors", "520", true));
                        appConfigRepository.save(new AppConfig("goshala_total_cows", "45", true));
                        appConfigRepository.save(new AppConfig("goshala_healthy_cows", "43", true));
                        System.out.println("Seeded App Configs.");
                }
        }

        private byte[] downloadImage(String urlString) {
                try (java.io.InputStream in = java.net.URI.create(urlString).toURL().openStream()) {
                        return in.readAllBytes();
                } catch (Exception e) {
                        return null;
                }
        }

        private void seedQuizQuestions() {
                if (quizQuestionRepository.count() == 0) {
                        createQuizQuestion("Who founded the Dvaita school of philosophy?",
                                        "Sri Madhvacharya", "Sri Ramanujacharya", "Sri Shankaracharya", "Sri Vadiraja",
                                        "A", "EN", "Philosophy");

                        createQuizQuestion("Where was Sri Vadiraja Teertha born?",
                                        "Udupi", "Sode", "Hoovinakere", "Pajaka",
                                        "C", "EN", "History");

                        createQuizQuestion("Which deity did Sri Madhvacharya install in Udupi?",
                                        "Sri Rama", "Sri Krishna", "Sri Narasimha", "Sri Vitthala",
                                        "B", "EN", "History");

                        createQuizQuestion("What is the name of Sri Vadiraja's magnum opus?",
                                        "Mahabharata Tatparya Nirnaya", "Nyaya Sudha", "Yukti Mallika",
                                        "Sumadhva Vijaya",
                                        "C", "EN", "Literature");

                        createQuizQuestion("In which place is the Sode Vadiraja Matha located?",
                                        "Sirsi", "Udupi", "Bangalore", "Mysore",
                                        "A", "EN", "General");

                        System.out.println("Seeded Quiz Questions.");
                }
        }

        private void createQuizQuestion(String q, String a, String b, String c, String d, String ans, String lang,
                        String cat) {
                QuizQuestion question = new QuizQuestion();
                question.setQuestion(q);
                question.setOptionA(a);
                question.setOptionB(b);
                question.setOptionC(c);
                question.setOptionD(d);
                question.setCorrectAnswer(ans);
                question.setLanguage(lang);
                question.setCategory(cat);
                quizQuestionRepository.save(question);
        }
}
